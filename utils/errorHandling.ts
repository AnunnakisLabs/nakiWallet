import { Platform, Alert } from 'react-native';

/**
 * Maneja errores de API y actualiza el estado de error
 * @param error El error a manejar
 * @param setErrorState Función para actualizar el estado de error
 * @param defaultMessage Mensaje por defecto en caso de que el error no tenga un mensaje específico
 * @returns El mensaje de error
 */
export function handleApiError(
  error: any, 
  setErrorState?: (error: string) => void, 
  defaultMessage = 'Error en la operación'
): string {
  const errorMessage = error?.message || defaultMessage;
  console.error('Error:', error);
  
  // Detectar errores de red específicamente
  if (errorMessage.includes('Network request failed') || error?.name === 'NetworkError') {
    const networkErrorMsg = 'Error de conexión. Por favor verifica tu conexión a internet.';
    if (setErrorState) {
      setErrorState(networkErrorMsg);
    }
    return networkErrorMsg;
  }
  
  if (setErrorState) {
    setErrorState(errorMessage);
  }
  
  if (Platform.OS === 'web') {
    alert(`Error: ${errorMessage}`);
  } else {
    Alert.alert('Error', errorMessage);
  }
  
  return errorMessage;
}

/**
 * Función para mostrar errores de validación sin alertas
 * @param message Mensaje de error
 * @param setErrorState Función para actualizar el estado de error
 */
export function showValidationError(
  message: string,
  setErrorState: (error: string) => void
) {
  setErrorState(message);
  console.warn('Validation error:', message);
}

/**
 * Valida que un monto sea mayor que cero
 * @param amount El monto a validar
 * @returns true si el monto es válido
 */
export function validateAmount(amount: string | number): boolean {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(numAmount) && numAmount > 0;
} 