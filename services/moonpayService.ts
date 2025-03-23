import { Platform, Linking } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Interfaz para los parámetros de la transacción de MoonPay
 */
export interface MoonPayTransactionParams {
  amount: number;
  destinationAddress: string;
  paymentMethod?: 'card' | 'paypal';
}

/**
 * Respuesta de una transacción de MoonPay
 */
export interface MoonPayTransactionResponse {
  success: boolean;
  redirectUrl?: string;
  error?: string;
  transactionId?: string;
}

/**
 * Crea una transacción en MoonPay y obtiene la URL para completar la compra
 */
export async function createMoonPayTransaction(
  params: MoonPayTransactionParams
): Promise<MoonPayTransactionResponse> {
  // Obtener la URL base de la app
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  
  const response = await fetch(`${baseUrl}/api/moonpay/create-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: params.amount,
      destinationAddress: params.destinationAddress,
      paymentMethod: params.paymentMethod
    }),
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Error al crear la URL de MoonPay');
  }

  return data;
}

/**
 * Abre la URL de MoonPay para completar la transacción
 */
export async function openMoonPayUrl(url: string): Promise<void> {
  if (Platform.OS === 'web') {
    window.location.href = url;
  } else {
    await Linking.openURL(url);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
}

/**
 * Función de conveniencia que crea una transacción y abre la URL de MoonPay
 */
export async function processMoonPayTransaction(
  params: MoonPayTransactionParams
): Promise<MoonPayTransactionResponse> {
  const data = await createMoonPayTransaction(params);
  
  if (data.success && data.redirectUrl) {
    await openMoonPayUrl(data.redirectUrl);
  }
  
  return data;
} 