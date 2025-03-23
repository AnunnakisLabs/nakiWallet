/**
 * Interfaz para los datos de la transacción
 */
export interface TransactionData {
  userId: string;
  amount: number;
  txHash?: string;
  paymentIntentId?: string;
  type: TransactionType;
  status: TransactionStatus;
  paymentMethod?: string;
  destinationAddress?: string;
}

/**
 * Interfaz para los datos de error de la transacción
 */
export interface TransactionErrorData {
  userId: string;
  error: string;
  amount?: number;
  type: TransactionType;
  status: 'FAILED';
  paymentMethod?: string;
}

/**
 * Tipos de transacciones
 */
export type TransactionType = 
  | 'FIAT_TO_USDC'
  | 'USDC_TO_FIAT'
  | 'USDC_TRANSFER_IN'
  | 'USDC_TRANSFER_OUT';

/**
 * Estados de la transacción
 */
export type TransactionStatus = 
  | 'PENDING'
  | 'COMPLETED'
  | 'FAILED';

/**
 * Respuesta de la API de transacciones
 */
export interface TransactionResponse {
  success: boolean;
  transactionId?: string;
  errorLogId?: string;
  error?: string;
}

/**
 * Registra una transacción en la base de datos
 */
export async function recordTransaction(
  txData: TransactionData
): Promise<TransactionResponse> {
  try {
    // Obtener la URL base de la app
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    
    const response = await fetch(`${baseUrl}/api/transactions/record`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(txData),
    });
    
    return await response.json();
  } catch (err: any) {
    console.error('Error al registrar transacción:', err);
    return { 
      success: false, 
      error: err.message || 'Error al registrar transacción' 
    };
  }
}

/**
 * Registra un error de transacción en la base de datos
 */
export async function recordTransactionError(
  errorData: TransactionErrorData
): Promise<TransactionResponse> {
  try {
    // Obtener la URL base de la app
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    
    const response = await fetch(`${baseUrl}/api/transactions/record-error`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorData),
    });
    
    return await response.json();
  } catch (err: any) {
    console.error('Error al registrar error de transacción:', err);
    return { 
      success: false, 
      error: err.message || 'Error al registrar error de transacción' 
    };
  }
} 