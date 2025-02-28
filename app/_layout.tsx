import Constants from 'expo-constants'
import '@/global.css'
import { useEffect } from 'react';
import { Stack } from 'expo-router'
import { PrivyProvider, usePrivy, useEmbeddedWallet } from '@privy-io/expo'
import { StatusBar } from 'expo-status-bar';

// Componente para crear wallet automáticamente cuando un usuario inicia sesión
function AutoWalletCreator() {
  const { user, isReady } = usePrivy();
  const wallet = useEmbeddedWallet();
  
  useEffect(() => {
    // Si el usuario está autenticado pero no tiene wallet, crearla
    const createWalletIfNeeded = async () => {
      if (isReady && user && wallet.status === 'not-created') {
        try {
          console.log('Creando wallet para el usuario...');
          await wallet.create();
          console.log('Wallet creada exitosamente');
        } catch (error) {
          console.error('Error al crear wallet:', error);
        }
      }
    };
    
    createWalletIfNeeded();
  }, [isReady, user, wallet]);
  
  return null; // Este componente no renderiza nada visible
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
        {/* Componente que crea wallet automáticamente */}
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
        </Stack>
        <StatusBar style="light" />
      </PrivyProvider>

  )
}
