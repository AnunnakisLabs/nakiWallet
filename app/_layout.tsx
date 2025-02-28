import Constants from 'expo-constants'
import '@/global.css'
import { useEffect } from 'react';
import { Stack } from 'expo-router'
import { PrivyProvider, usePrivy, useEmbeddedWallet, getUserEmbeddedWallet } from '@privy-io/expo'
import { StatusBar } from 'expo-status-bar';


const BASE_TESTNET_CHAIN_ID = '0x14a33';
const BASE_TESTNET_NAME = 'Base Goerli Testnet';
const BASE_TESTNET_RPC_URL = 'https://goerli.base.org';


function AutoWalletCreator() {
  const { user, isReady } = usePrivy();
  const wallet = useEmbeddedWallet();
  
  useEffect(() => {
    const setupWallet = async () => {
      if (!isReady || !user) return;
      
      try {
        console.log('Verificando estado de la wallet...');
        
        if (wallet.status === 'not-created') {
          console.log('Creando wallet para el usuario...');
          await wallet.create();
          console.log('Wallet creada exitosamente');
        }
        
        if (wallet.status === 'connected') {
          const currentChain = await wallet.provider.request({
            method: 'eth_chainId',
          });
          
          if (currentChain !== BASE_TESTNET_CHAIN_ID) {
            console.log(`Cambiando de cadena ${currentChain} a Base Testnet (${BASE_TESTNET_CHAIN_ID})`);
            try {
              await wallet.provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: BASE_TESTNET_CHAIN_ID }],
              });
            } catch (switchError) {
              if (switchError.code === 4902) {
                await wallet.provider.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: BASE_TESTNET_CHAIN_ID,
                      chainName: BASE_TESTNET_NAME,
                      rpcUrls: [BASE_TESTNET_RPC_URL],
                      nativeCurrency: {
                        name: 'Ethereum',
                        symbol: 'ETH',
                        decimals: 18,
                      },
                      blockExplorerUrls: ['https://goerli.basescan.org/'],
                    },
                  ],
                });
                

                await wallet.provider.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: BASE_TESTNET_CHAIN_ID }],
                });
              } else {
                throw switchError;
              }
            }
            console.log('Cambio de cadena exitoso');
          } else {
            console.log('Ya en Base Testnet, no se requiere cambio');
          }
        }
      } catch (error) {
        console.error('Error al configurar wallet:', error);
      }
    };
    
    setupWallet();
  }, [isReady, user, wallet]);
  
  return null; 
}

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

export default function RootLayout() {
  useEffect(() => {
    window.frameworkReady?.();
  }, []);

  return (
    <PrivyProvider
      appId={Constants.expoConfig?.extra?.privyAppId}
      clientId={Constants.expoConfig?.extra?.privyClientId}
    >
      <AutoWalletCreator />
      
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="edit-profile" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="nfc-payment" />
        <Stack.Screen name="add-money" />
        <Stack.Screen name="add-money-crypto" />
        <Stack.Screen name="add-money-debit" />
        <Stack.Screen name="add-money-bank" />
        <Stack.Screen name="add-money-paypal" />
        <Stack.Screen name="friend-profile" />
        <Stack.Screen name="faq" />
        <Stack.Screen name="contact" />
        <Stack.Screen name="terms" />
        <Stack.Screen name="privacy" />
        <Stack.Screen name="income" />
        <Stack.Screen name="expenses" />
        <Stack.Screen name="history" />
      </Stack>
      <StatusBar style="light" />
    </PrivyProvider>
  )
}