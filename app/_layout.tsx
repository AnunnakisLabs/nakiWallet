import Constants from 'expo-constants'
import '@/global.css'
import { useEffect } from 'react';
import { GluestackUIProvider } from '@/components/gluestack-ui/gluestack-ui-provider'
import { Stack } from 'expo-router'
import { PrivyProvider, PrivyElements } from '@privy-io/expo'
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter'
import { useFonts } from 'expo-font'
import { StatusBar } from 'expo-status-bar';

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
    <>
      <PrivyProvider
        appId={Constants.expoConfig?.extra?.privyAppId}
        clientId={Constants.expoConfig?.extra?.privyClientId}
      >
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
    </>
  )
}
