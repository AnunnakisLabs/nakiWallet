import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getUserEmbeddedWallet, usePrivy } from '@privy-io/expo';
import useBlockchain from '@/hooks/useBlockchain';
import { AddMoneyScreen } from '@/components/AddMoneyScreen';
import { validateAmount, showValidationError, handleApiError } from '@/utils/errorHandling';

export default function AddMoneyDebitScreen() {
  const router = useRouter();
  const { user } = usePrivy();
  const { balance, isLoading: blockchainLoading, refreshBalance, buyUSDCWithMoonPay } = useBlockchain();
  
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const quickAmounts = ['$50', '$100', '$200', '$500', '$1000'];

  useEffect(() => {
    refreshBalance();
    getWalletAddress();
  }, [user]);

  const getWalletAddress = async () => {
    try {
      if (user) {
        const wallet = getUserEmbeddedWallet(user);
        if (wallet?.address) {
          setWalletAddress(wallet.address);
        } else {
          setError('No se encontró dirección de wallet');
        }
      }
    } catch (err) {
      handleApiError(err, setError, 'Error al obtener la dirección de la wallet');
    }
  };

  const handleAddMoney = async () => {
    if (!validateAmount(amount)) {
      showValidationError('Por favor ingresa un monto válido', setError);
      return;
    }

    if (!walletAddress) {
      showValidationError('No se encontró dirección de wallet', setError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await buyUSDCWithMoonPay(parseFloat(amount), 'card');

      if (!result.success) {
        throw new Error((result as any).error || 'Error al procesar la compra');
      }

      // Mostramos un mensaje de éxito en vez de redirigir
      console.log('Compra simulada exitosa:', result);
      alert(`¡Compra exitosa! Se han agregado ${amount} USDC a tu wallet.`);
      
      // Regresamos a la pantalla anterior después de una compra exitosa
      router.back();
    } catch (err) {
      handleApiError(err, setError, 'Error al procesar la compra');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AddMoneyScreen 
      title="Buy USDC with Card"
      balance={balance}
      amount={amount}
      setAmount={setAmount}
      walletAddress={walletAddress}
      isLoading={isLoading || blockchainLoading}
      error={error}
      handleAddMoney={handleAddMoney}
      paymentIcon="credit-card"
      paymentButtonText="Continue to MoonPay"
      goBack={() => router.back()}
    />
  );
}