import { useState, useCallback, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { usePrivy, useEmbeddedWallet, getUserEmbeddedWallet } from '@privy-io/expo';
import * as SecureStore from 'expo-secure-store';
import { formatUnits, parseUnits } from 'viem';
import { EventEmitter } from 'events';

const balanceEmitter = new EventEmitter();
const BALANCE_CHANGED_EVENT = 'balance-changed';

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


const USDC_CONTRACT_ADDRESS = '0xf175520c52418dfe19c8098071a252da48cd1c19'; 

export const useBlockchain = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const { user, isReady } = usePrivy();
  const wallet = useEmbeddedWallet();

  const updateBalanceState = useCallback(async (newBalance: number) => {
    setBalance(newBalance);
    
    await SecureStore.setItemAsync('usdc_balance', newBalance.toString());
    
    balanceEmitter.emit(BALANCE_CHANGED_EVENT, newBalance);
    
    console.log('Balance actualizado:', newBalance);
  }, []);

  useEffect(() => {
    const handleBalanceChange = (newBalance: number) => {
      if (balance !== newBalance) {
        setBalance(newBalance);
        console.log('Balance actualizado desde evento:', newBalance);
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

const refreshBalance = useCallback(async () => {
    let storedBalance = null;
    
    try {
      const storedBalanceStr = await SecureStore.getItemAsync('usdc_balance');
      if (storedBalanceStr) {
        storedBalance = parseFloat(storedBalanceStr);
        if (!isNaN(storedBalance)) {
          setBalance(storedBalance);
        }
      }
    } catch (err) {
      console.error('Error al leer balance almacenado:', err);
    }
  
    if (!isReady || !user || wallet.status !== 'connected') {
      return;
    }
  
    setIsLoading(true);
    setError(null);
    
    try {
      const userWallet = getUserEmbeddedWallet(user);
      
      if (!userWallet?.address) {
        throw new Error('No se encontró dirección de wallet');
      }
  
      const onchainBalance = await getUSDCBalance(wallet.provider, userWallet.address);
      
      await updateBalanceState(onchainBalance);
    } catch (err) {
      console.error('Error al obtener balance:', err);
      
      if (storedBalance !== null && !isNaN(storedBalance)) {
        await updateBalanceState(storedBalance);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isReady, user, wallet, updateBalanceState]);

  const sendUSDCToAddress = useCallback(async (
    toAddress: string,
    amount: number,
    note: string = ''
  ) => {
    if (!isReady || !user || wallet.status !== 'connected') {
      setError('La wallet no está conectada');
      return { success: false, error: 'Wallet no conectada' };
    }

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
      const userWallet = getUserEmbeddedWallet(user);
      
      if (!userWallet?.address) {
        throw new Error('No se encontró dirección de wallet');
      }

      const txHash = await sendUSDC(
        wallet.provider,
        userWallet.address,
        toAddress,
        amount
      );

      const newBalance = balance - amount;
      await updateBalanceState(newBalance);

      return { 
        success: true, 
        txHash,
        amount,
        toAddress,
        note,
        timestamp: Date.now()
      };
    } catch (err: any) {
      console.error('Error al enviar USDC:', err);
      const errorMessage = err.message || 'Error al procesar la transacción';
      setError(errorMessage);
      
      if (Platform.OS === 'web') {
        alert(`Error: ${errorMessage}`);
      } else {
        Alert.alert('Error de transacción', errorMessage);
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [isReady, user, wallet, balance, updateBalanceState]);

  const receiveUSDC = useCallback(async (amount: number) => {
    console.log('receiveUSDC llamado con:', amount);
    
    if (!amount || isNaN(amount) || amount <= 0) {
      console.error('Monto inválido:', amount);
      setError('El monto debe ser mayor a 0');
      return false;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Balance actual:', balance);
      const currentBalance = balance || 0;
      const newBalance = currentBalance + amount;
      console.log('Nuevo balance calculado:', newBalance);
      
      await updateBalanceState(newBalance);
      console.log('Balance actualizado con éxito');
      
      return true;
    } catch (err: any) {
      console.error('Error al recibir fondos:', err);
      setError(err.message || 'Error al procesar la transacción');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [balance, updateBalanceState]);

  const getTransactionHistory = useCallback(async () => {
    if (!isReady || !user || wallet.status !== 'connected') {
      return [];
    }

    setIsLoading(true);
    
    try {
      const userWallet = getUserEmbeddedWallet(user);
      
      if (!userWallet?.address) {
        return [];
      }

      return await getRecentTransactions(userWallet.address);
    } catch (err) {
      console.error('Error al obtener historial:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isReady, user, wallet]);

  async function getUSDCBalance(provider, address) {
    try {
      console.log("Obteniendo balance desde SecureStore (sin intentar blockchain)");
      const storedBalance = await SecureStore.getItemAsync('usdc_balance');
      if (storedBalance) {
        const parsedBalance = parseFloat(storedBalance);
        if (!isNaN(parsedBalance)) {
          return parsedBalance;
        }
      }
      return 100.00;
    } catch (error) {
      console.error('Error al obtener balance desde SecureStore:', error);
      return 100.00;
    }
  }

  async function sendUSDC(provider, fromAddress, toAddress, amount) {
    try {
      const amountInBaseUnits = parseUnits(amount.toString(), 6);

      const data = encodeFunctionData({
        abi: usdcAbi,
        functionName: 'transfer',
        args: [toAddress, amountInBaseUnits.toString()],
      });

      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: fromAddress,
          to: USDC_CONTRACT_ADDRESS,
          data,
        }],
      });

      return txHash;
    } catch (error) {
      console.error('Error al enviar USDC:', error);
      throw error;
    }
  }

  async function getRecentTransactions(address) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      {
        id: '0x' + Math.random().toString(16).substring(2, 10),
        type: 'received',
        amount: 50,
        from: 'Alice',
        fromAddress: '0x765d392C019D36372f9b2D9Ce947D73fd12Aa02d',
        toAddress: address,
        timestamp: Date.now() - 3600000, 
        status: 'confirmed',
        message: '🎮 Payment for game assets',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120'
      },
      {
        id: '0x' + Math.random().toString(16).substring(2, 10),
        type: 'sent',
        amount: 25,
        to: 'Bob',
        toAddress: '0x9876543210fedcba9876543210fedcba98765432',
        fromAddress: address,
        timestamp: Date.now() - 86400000, 
        message: '🍕 Dinner split',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=120'
      },
      {
        id: '0x' + Math.random().toString(16).substring(2, 10),
        type: 'received',
        amount: 100,
        from: 'Carol',
        fromAddress: '0xabcdef0123456789abcdef0123456789abcdef01',
        toAddress: address,
        timestamp: Date.now() - 172800000, 
        status: 'confirmed', 
        message: '💻 Freelance project',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120'
      }
    ];
  }

  function encodeFunctionData({ abi, functionName, args }) {
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

  return {
    balance,
    isLoading,
    error,
    refreshBalance,
    sendUSDC: sendUSDCToAddress,
    receiveUSDC,
    getTransactionHistory,
    wallet
  };
};

export default useBlockchain;