import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const MOONPAY_WIDGET_URL = 'https://buy.moonpay.com';

// Exportación por defecto para Expo Router
export default function ApiMoonpayCreateUrl() {
  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, destinationAddress, paymentMethod } = body;

    // Crear URL firmada para MoonPay
    const urlParams = new URLSearchParams({
      apiKey: process.env.MOONPAY_PUBLIC_KEY!,
      currencyCode: 'usdc_base',
      walletAddress: destinationAddress,
      baseCurrencyAmount: amount.toString(),
      baseCurrencyCode: 'usd',
      showWalletAddressForm: 'false',
      redirectURL: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`
    });

    // Agregar PayPal como método de pago si se especifica
    if (paymentMethod === 'paypal') {
      urlParams.append('defaultPaymentMethod', 'paypal_transfer');
    }

    // Firmar la URL si se proporciona la clave secreta
    if (process.env.MOONPAY_SECRET_KEY) {
      const signature = await createSignature(urlParams.toString());
      urlParams.append('signature', signature);
    }

    const moonpayUrl = `${MOONPAY_WIDGET_URL}?${urlParams.toString()}`;

    return NextResponse.json({
      success: true,
      redirectUrl: moonpayUrl
    });
  } catch (err: any) {
    console.error('Error creating MoonPay URL:', err);
    return NextResponse.json({
      success: false,
      error: err.message,
    }, { status: 400 });
  }
}

async function createSignature(urlParams: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(urlParams);
  
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(process.env.MOONPAY_SECRET_KEY!),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, data);
  
  // Convertir el ArrayBuffer a Base64 sin usar Buffer
  return arrayBufferToBase64(signature);
}

// Función auxiliar para convertir ArrayBuffer a Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
} 