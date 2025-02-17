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
            contentStyle: { backgroundColor: '#8134AF' },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="signup" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" />
      </PrivyProvider>
    </>
  )
}
