import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Exportación por defecto para Expo Router
export default function ApiTransactionsRecord() {
  return null;
}

// Simular registro de transacción sin usar Prisma directamente
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, amount, txHash, paymentIntentId, type, status } = body;

    // Simulación de registro exitoso
    console.log('Registrando transacción:', {
      userId,
      amount: parseFloat(amount),
      txHash,
      paymentIntentId,
      type,
      status,
      createdAt: new Date(),
    });

    // Devolver respuesta simulada exitosa
    return NextResponse.json({
      success: true,
      transactionId: `tx_${Date.now().toString(36)}`,
    });
  } catch (err: any) {
    console.error('Error recording transaction:', err);
    return NextResponse.json({
      success: false,
      error: err.message,
    }, { status: 400 });
  }
} 