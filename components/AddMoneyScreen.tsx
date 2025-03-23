import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';

export interface AddMoneyScreenProps {
  /**
   * Título de la pantalla (ej: "Buy USDC with Card", "Buy USDC with PayPal")
   */
  title: string;
  
  /**
   * Balance actual de USDC
   */
  balance: number;
  
  /**
   * Valor del campo de monto
   */
  amount: string;
  
  /**
   * Función para actualizar el monto
   */
  setAmount: (amount: string) => void;
  
  /**
   * Dirección de la wallet del usuario
   */
  walletAddress: string | null;
  
  /**
   * Estado de carga
   */
  isLoading: boolean;
  
  /**
   * Mensaje de error
   */
  error: string | null;
  
  /**
   * Función para manejar el botón de agregar dinero
   */
  handleAddMoney: () => Promise<void>;
  
  /**
   * Icono para el botón de pago (ej: "credit-card", "paypal")
   */
  paymentIcon: string;
  
  /**
   * Texto para el botón de pago (ej: "Continue to MoonPay", "Continue to PayPal")
   */
  paymentButtonText: string;
  
  /**
   * Función para volver a la pantalla anterior
   */
  goBack: () => void;
}

/**
 * Componente reutilizable para las pantallas de compra de USDC
 */
export function AddMoneyScreen({
  title,
  balance,
  amount,
  setAmount,
  walletAddress,
  isLoading,
  error,
  handleAddMoney,
  paymentIcon,
  paymentButtonText,
  goBack
}: AddMoneyScreenProps) {
  
  const quickAmounts = ['$50', '$100', '$200', '$500', '$1000'];
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Current Balance */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceValue}>${balance.toFixed(2)} USDC</Text>
        </View>

        {/* Amount Section */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Enter Amount (USD)</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              placeholderTextColor="#B39DDB"
              editable={!isLoading}
            />
          </View>
        </View>

        {/* USDC Value */}
        {amount ? (
          <View style={styles.usdcValueContainer}>
            <Text style={styles.usdcValueText}>
              You will receive approximately {parseFloat(amount) ? parseFloat(amount).toFixed(2) : "0.00"} USDC
            </Text>
          </View>
        ) : null}

        {/* Quick Amounts */}
        <View style={styles.quickAmountsContainer}>
          {quickAmounts.map((quickAmount) => (
            <TouchableOpacity
              key={quickAmount}
              style={styles.quickAmountButton}
              onPress={() => setAmount(quickAmount.replace('$', ''))}
              disabled={isLoading}
            >
              <Text style={styles.quickAmountText}>{quickAmount}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Wallet Address */}
        <View style={styles.walletInfoContainer}>
          <Text style={styles.walletLabel}>USDC will be sent to:</Text>
          <Text style={styles.walletAddress}>
            {walletAddress 
              ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` 
              : "Loading wallet address..."}
          </Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.addButton, isLoading && styles.addButtonDisabled]}
          onPress={handleAddMoney}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <FontAwesome name={paymentIcon as any} size={18} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.addButtonText}>{paymentButtonText}</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Nota sobre seguridad */}
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            You will be redirected to MoonPay's secure payment platform to complete your purchase.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8134AF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 10,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    borderRadius: 10,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#E0E0E0',
    marginBottom: 5,
  },
  balanceValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  amountSection: {
    padding: 20,
  },
  amountLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencySymbol: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  amountInput: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    minWidth: 150,
    textAlign: 'center',
  },
  usdcValueContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  usdcValueText: {
    color: '#E0E0E0',
    fontSize: 16,
  },
  quickAmountsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  quickAmountButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickAmountText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  walletInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 20,
    marginTop: 10,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  walletLabel: {
    color: '#E0E0E0',
    fontSize: 14,
    marginBottom: 8,
  },
  walletAddress: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'Courier',
      android: 'monospace',
      default: 'monospace',
    }),
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 75, 75, 0.1)',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#FF4B4B',
    fontSize: 14,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#9C27B0',
    margin: 20,
    marginBottom: 10,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    opacity: 0.7,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 8,
  },
  noteContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  noteText: {
    color: '#E0E0E0',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 