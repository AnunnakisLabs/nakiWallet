import { useState, useCallback, useEffect } from 'react';
import { Alert, Platform, Linking } from 'react-native';
import { usePrivy, useEmbeddedWallet, getUserEmbeddedWallet } from '@privy-io/expo';
import * as SecureStore from 'expo-secure-store';
import { formatUnits, parseUnits } from 'viem';
import { EventEmitter } from 'events';
import { sepolia } from 'viem/chains';
import { createPublicClient, http } from 'viem';
import { handleApiError } from '@/utils/errorHandling';
import { 
  createMoonPayTransaction, 
  openMoonPayUrl, 
  MoonPayTransactionParams 
} from '@/services/moonpayService';
import { 
  recordTransaction, 
  recordTransactionError, 
  TransactionData,
  TransactionErrorData 
} from '@/services/transactionService';

const balanceEmitter = new EventEmitter();
const BALANCE_CHANGED_EVENT = 'balance-changed';

// Sepolia USDC contract address
const USDC_CONTRACT_ADDRESS = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';

// MoonPay configuration
const MOONPAY_API_KEY = 'YOUR_MOONPAY_API_KEY'; // Reemplazar con tu API key de MoonPay
const MOONPAY_BASE_URL = 'https://buy-staging.moonpay.com'; // URL de staging/testing

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http()
});

const usdcAbi = [
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    name: 'transfer',
    type: 'function',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    outputs: [{ name: 'success', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    name: 'Transfer',
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
  }
];

export const useBlockchain = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const { user, isReady } = usePrivy();
  const wallet = useEmbeddedWallet();

  /**
   * Verifica el estado de la wallet
   * @returns Objeto con el estado de validación y mensaje de error si aplica
   */
  const checkWalletStatus = useCallback(() => {
    if (!isReady || !user || wallet.status !== 'connected') {
      setError('La wallet no está conectada');
      return { valid: false, error: 'Wallet no conectada' };
    }
    return { valid: true };
  }, [isReady, user, wallet.status]);

  /**
   * Obtiene la dirección de la wallet o lanza un error
   * @returns La dirección de la wallet
   */
  const getWalletAddressOrThrow = useCallback(() => {
    const userWallet = getUserEmbeddedWallet(user);
    if (!userWallet?.address) {
      throw new Error('No se encontró dirección de wallet');
    }
    return userWallet.address;
  }, [user]);

  /**
   * Actualiza el estado del balance y emite un evento
   */
  const updateBalanceState = useCallback(async (newBalance: number) => {
    setBalance(newBalance);
    await SecureStore.setItemAsync('usdc_balance', newBalance.toString());
    balanceEmitter.emit(BALANCE_CHANGED_EVENT, newBalance);
  }, []);

  useEffect(() => {
    const handleBalanceChange = (newBalance: number) => {
      if (balance !== newBalance) {
        setBalance(newBalance);
      }
    };
    
    balanceEmitter.on(BALANCE_CHANGED_EVENT, handleBalanceChange);
    return () => {
      balanceEmitter.off(BALANCE_CHANGED_EVENT, handleBalanceChange);
    };
  }, [balance]);

  useEffect(() => {
    refreshBalance();
  }, [isReady, user, wallet.status]);

  /**
   * Actualiza el balance de USDC del usuario
   */
  const refreshBalance = useCallback(async () => {
    if (!isReady || !user || wallet.status !== 'connected') {
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const walletAddress = getWalletAddressOrThrow();

      // Comentamos la llamada real y usamos un valor simulado para la demostración
      // const balance = await publicClient.readContract({
      //   address: USDC_CONTRACT_ADDRESS,
      //   abi: usdcAbi,
      //   functionName: 'balanceOf',
      //   args: [walletAddress],
      // }) as bigint;
      
      // Simulación para demostración
      console.log(`Consultando balance para: ${walletAddress}`);
      // Simulamos un pequeño retraso
      await new Promise(resolve => setTimeout(resolve, 500));
      // Simulamos un balance para la demostración
      const simulatedBalance = 100.00;

      // Actualizamos el estado con el balance simulado
      await updateBalanceState(simulatedBalance);
    } catch (err) {
      handleApiError(err, setError, 'Error al obtener balance');
    } finally {
      setIsLoading(false);
    }
  }, [isReady, user, wallet, getWalletAddressOrThrow, updateBalanceState]);

  /**
   * Registra un error de transacción en la base de datos
   */
  const logTransactionError = useCallback(async (
    err: any, 
    amount: number, 
    type: string, 
    paymentMethod?: string
  ) => {
    const errorMessage = handleApiError(err, setError, 'Error al procesar la transacción');
    
    if (user) {
      const errorData: TransactionErrorData = {
        userId: user.id,
        error: errorMessage,
        amount,
        type: type as any,
        status: 'FAILED',
        paymentMethod
      };
      
      await recordTransactionError(errorData);
    }
    
    return { success: false, error: errorMessage };
  }, [user]);

  /**
   * Envía USDC a una dirección específica
   */
  const sendUSDCToAddress = useCallback(async (
    toAddress: string,
    amount: number,
    note: string = ''
  ) => {
    const walletStatus = checkWalletStatus();
    if (!walletStatus.valid) return { success: false, error: walletStatus.error };

    if (!amount || isNaN(amount) || amount <= 0) {
      setError('El monto debe ser mayor a 0');
      return { success: false, error: 'Monto inválido' };
    }

    if (amount > balance) {
      setError('Balance insuficiente');
      return { success: false, error: 'Balance insuficiente' };
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const walletAddress = getWalletAddressOrThrow();
      
      // Simular un retraso para la transacción
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generar un hash de transacción simulado
      const txHash = '0x' + Math.random().toString(16).substring(2, 66);
      console.log(`Simulando envío de ${amount} USDC a ${toAddress} desde ${walletAddress}`);
      
      // Simular actualización de balance (restar el monto enviado)
      const newBalance = Math.max(0, balance - amount);
      await updateBalanceState(newBalance);
      
      // Registrar la transacción
      if (user) {
        await recordTransaction({
          userId: user.id,
          amount,
          txHash,
          type: 'USDC_TRANSFER_OUT',
          status: 'COMPLETED',
        });
      }

      return { 
        success: true, 
        txHash,
        amount,
        toAddress,
        note,
        timestamp: Date.now()
      };
    } catch (err) {
      return logTransactionError(err, amount, 'USDC_TRANSFER_OUT');
    } finally {
      setIsLoading(false);
    }
  }, [
    checkWalletStatus, 
    balance, 
    getWalletAddressOrThrow, 
    updateBalanceState,
    user, 
    logTransactionError
  ]);

  /**
   * Obtiene el historial de transacciones del usuario
   */
  const getTransactionHistory = useCallback(async () => {
    const walletStatus = checkWalletStatus();
    if (!walletStatus.valid) return [];

    setIsLoading(true);
    setError(null);
    
    try {
      const walletAddress = getWalletAddressOrThrow();
      console.log(`Consultando historial para wallet: ${walletAddress} en la red Sepolia`);
      
      // Obtener el número del bloque más reciente
      const latestBlock = await publicClient.getBlockNumber();
      console.log(`Bloque más reciente: ${latestBlock}`);
      
      // Para evitar el error de consultar demasiados bloques (>10000), 
      // limitamos la búsqueda a los últimos 5000 bloques
      const fromBlock = latestBlock - 5000n > 0n ? latestBlock - 5000n : 0n;
      console.log(`Consultando desde el bloque: ${fromBlock}`);
      
      // Definir el tipo para los eventos de transferencia
      type TransferEvent = {
        transactionHash: `0x${string}`;
        args: {
          from: `0x${string}`;
          to: `0x${string}`;
          value: bigint;
        };
      };
      
      // Obtener eventos de Transfer del contrato USDC
      const incomingEvents = await publicClient.getContractEvents({
        address: USDC_CONTRACT_ADDRESS,
        abi: usdcAbi,
        eventName: 'Transfer',
        args: {
          to: walletAddress as `0x${string}`
        },
        fromBlock,
        toBlock: 'latest'
      }) as unknown as TransferEvent[];
      
      const outgoingEvents = await publicClient.getContractEvents({
        address: USDC_CONTRACT_ADDRESS,
        abi: usdcAbi,
        eventName: 'Transfer',
        args: {
          from: walletAddress as `0x${string}`
        },
        fromBlock,
        toBlock: 'latest'
      }) as unknown as TransferEvent[];
      
      console.log(`Eventos encontrados - Entrantes: ${incomingEvents.length}, Salientes: ${outgoingEvents.length}`);
      
      // Combinar y formatear los eventos
      const allTransactions = [
        ...incomingEvents.map((event, index) => {
          const from = event.args.from;
          const to = event.args.to;
          const value = event.args.value;
          
          return {
            id: `in_${index}`,
            type: 'received',
            amount: Number(formatUnits(value, 6)),
            fromAddress: from,
            toAddress: to,
            timestamp: Date.now() - (index * 3600000), // Simular fechas escalonadas
            status: 'confirmed',
            txHash: event.transactionHash
          };
        }),
        
        ...outgoingEvents.map((event, index) => {
          const from = event.args.from;
          const to = event.args.to;
          const value = event.args.value;
          
          return {
            id: `out_${index}`,
            type: 'sent',
            amount: Number(formatUnits(value, 6)),
            fromAddress: from,
            toAddress: to,
            timestamp: Date.now() - (index * 3600000), // Simular fechas escalonadas
            status: 'confirmed',
            txHash: event.transactionHash
          };
        })
      ];
      
      // Ordenar por timestamp en orden descendente (más reciente primero)
      allTransactions.sort((a, b) => b.timestamp - a.timestamp);
      
      // Si no hay transacciones en la blockchain, devolver al menos una simulada
      if (allTransactions.length === 0) {
        console.log('No se encontraron transacciones reales, devolviendo una simulada para demostración');
        return [
          {
            id: 'mock_1',
            type: 'received',
            amount: 100.00,
            fromAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
            toAddress: walletAddress,
            timestamp: Date.now() - 86400000,
            status: 'confirmed',
            txHash: '0x' + Math.random().toString(16).substring(2, 42)
          }
        ];
      }
      
      return allTransactions;
    } catch (err) {
      console.error('Error al obtener transacciones:', err);
      handleApiError(err, setError, 'Error al obtener historial de transacciones');
      
      // En caso de error, devolver datos simulados para mantener la experiencia del usuario
      return [
        {
          id: 'error_fallback',
          type: 'received',
          amount: 50.00,
          fromAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
          toAddress: getWalletAddressOrThrow(),
          timestamp: Date.now() - 86400000,
          status: 'confirmed',
          txHash: '0x' + Math.random().toString(16).substring(2, 42),
          isSimulated: true
        }
      ];
    } finally {
      setIsLoading(false);
    }
  }, [checkWalletStatus, getWalletAddressOrThrow]);

  /**
   * Función auxiliar para codificar los datos de la función del contrato
   */
  function encodeFunctionData({ abi, functionName, args }: any) {
    if (functionName === 'balanceOf') {
      const selector = '0x70a08231';
      const paddedAddress = args[0].slice(2).padStart(64, '0');
      return `${selector}${paddedAddress}`;
    }
    
    if (functionName === 'transfer') {
      const selector = '0xa9059cbb';
      const paddedAddress = args[0].slice(2).padStart(64, '0');
      const amountHex = BigInt(args[1]).toString(16).padStart(64, '0');
      return `${selector}${paddedAddress}${amountHex}`;
    }
    
    throw new Error(`Function ${functionName} not supported in simplified encoder`);
  }

  /**
   * Compra USDC a través de MoonPay con tarjeta o PayPal
   */
  const buyUSDCWithMoonPay = useCallback(async (
    amount: number,
    paymentMethod: 'card' | 'paypal' = 'card'
  ) => {
    const walletStatus = checkWalletStatus();
    if (!walletStatus.valid) return { success: false, error: walletStatus.error };

    if (!amount || isNaN(amount) || amount <= 0) {
      setError('El monto debe ser mayor a 0');
      return { success: false, error: 'Monto inválido' };
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const walletAddress = getWalletAddressOrThrow();
      
      // Simulamos un retraso para la transacción
      console.log(`Simulando compra de ${amount} USDC usando ${paymentMethod} a la dirección ${walletAddress}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En lugar de llamar a createMoonPayTransaction, simulamos una respuesta exitosa
      const mockRedirectUrl = 'https://buy-sandbox.moonpay.com/transaction?walletAddress=' + 
          walletAddress + '&currencyCode=usdc&paymentMethod=' + paymentMethod;
      
      // Simulamos un aumento en el balance
      const newBalance = balance + amount;
      await updateBalanceState(newBalance);
      
      // Registrar la transacción
      let transactionId = 'tx_' + Date.now().toString(36);
      if (user) {
        const txResponse = await recordTransaction({
          userId: user.id,
          amount,
          type: 'FIAT_TO_USDC',
          status: 'COMPLETED', // Cambiamos a COMPLETED para simulación
          paymentMethod,
          destinationAddress: walletAddress
        });
        
        if (txResponse.transactionId) {
          transactionId = txResponse.transactionId;
        }
      }

      return {
        success: true,
        redirectUrl: mockRedirectUrl,
        transactionId
      };
    } catch (err) {
      return logTransactionError(err, amount, 'FIAT_TO_USDC', paymentMethod);
    } finally {
      setIsLoading(false);
    }
  }, [
    checkWalletStatus, 
    getWalletAddressOrThrow,
    balance,
    updateBalanceState,
    user, 
    logTransactionError
  ]);

  return {
    balance,
    isLoading,
    error,
    refreshBalance,
    sendUSDC: sendUSDCToAddress,
    getTransactionHistory,
    wallet,
    buyUSDCWithMoonPay
  };
};

export default useBlockchain;