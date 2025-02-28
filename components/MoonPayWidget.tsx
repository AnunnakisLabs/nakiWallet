import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useMoonPaySdk } from '@moonpay/react-native-moonpay-sdk';
import * as WebBrowser from 'expo-web-browser';

export const MoonPayWidget = ({ walletAddress }) => {
  const { openWithInAppBrowser } = useMoonPaySdk({
    sdkConfig: {
      flow: 'buy',
      environment: 'sandbox',
      params: {
        apiKey: 'pk_test_hqZBzyRw37zLkEp1kJo9n3FxPzNkGHQ',
        baseCurrencyCode: 'usd',
        baseCurrencyAmount: '100',
        defaultCurrencyCode: 'usdc',
        walletAddress: walletAddress,
        colorCode: '%238134AF',
      },
    },
    browserOpener: {
      open: async (url) => {
        try {
          // No retornamos nada (void) como espera el tipo
          await WebBrowser.openBrowserAsync(url);
        } catch (error) {
          console.error('Error al abrir el navegador:', error);
        }
      },
    },
  });

  const handleOpenMoonPay = () => {
    openWithInAppBrowser();
  };

  return (
    <View style={styles.container}>
      <Button 
        title="Comprar USDC" 
        onPress={handleOpenMoonPay} 
        color="#8134AF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});