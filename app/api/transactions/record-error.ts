import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Exportación por defecto para Expo Router
export default function ApiTransactionsRecordError() {
  return null;
}

// Simular registro de error sin usar Prisma directamente
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, error, amount, type, status } = body;

    // Simulación de registro exitoso del error
    console.log('Registrando error de transacción:', {
      userId,
      errorMessage: error,
      amount: amount ? parseFloat(amount) : undefined,
      type,
      status,
      createdAt: new Date(),
    });

    // Devolver respuesta simulada exitosa
    return NextResponse.json({
      success: true,
      errorLogId: `err_${Date.now().toString(36)}`,
    });
  } catch (err: any) {
    console.error('Error recording transaction error:', err);
    return NextResponse.json({
      success: false,
      error: err.message,
    }, { status: 400 });
  }
} 