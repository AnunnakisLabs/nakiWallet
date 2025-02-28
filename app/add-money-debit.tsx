import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { getUserEmbeddedWallet, usePrivy } from '@privy-io/expo';
import * as Haptics from 'expo-haptics';
import * as SecureStore from 'expo-secure-store'; // Usando SecureStore para almacenamiento

export default function AddMoneyDebitScreen() {
  const router = useRouter();
  const { user } = usePrivy();
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const quickAmounts = ['$50', '$100', '$200', '$500', '$1000'];

  // Get the user's wallet address
  useEffect(() => {
    const getWalletAddress = async () => {
      try {
        if (user) {
          const wallet = getUserEmbeddedWallet(user);
          if (wallet?.address) {
            setWalletAddress(wallet.address);
            console.log("Wallet address set:", wallet.address);
          } else {
            console.log("No wallet address found for user");
            // Si no hay dirección de wallet, configurar una por defecto para pruebas
            setWalletAddress("0x1234567890abcdef1234567890abcdef12345678");
          }
        }
      } catch (err) {
        console.error("Error getting wallet address:", err);
        // Fallback para pruebas
        setWalletAddress("0x1234567890abcdef1234567890abcdef12345678");
      }
    };

    getWalletAddress();
  }, [user]);

  // Función para guardar en SecureStore
  async function saveBalance(balance: number) {
    try {
      // Primero obtenemos el balance actual
      const currentBalanceStr = await SecureStore.getItemAsync('usdc_balance');
      let currentBalance = 0;
      
      if (currentBalanceStr) {
        currentBalance = parseFloat(currentBalanceStr);
      }
      
      // Sumamos el nuevo monto
      const newBalance = currentBalance + parseFloat(amount);
      
      // Guardamos el nuevo balance
      await SecureStore.setItemAsync('usdc_balance', newBalance.toString());
      console.log("Balance guardado:", newBalance);
      return true;
    } catch (error) {
      console.error("Error al guardar balance:", error);
      return false;
    }
  }

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = cleaned.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return text;
    }
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const validateCardDetails = () => {
    if (!amount || !cardNumber || !expiryDate || !cvv) {
      setError('Please fill in all fields');
      return false;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    // Basic card validation
    const cardNumberClean = cardNumber.replace(/\s/g, '');
    if (cardNumberClean.length < 16) {
      setError('Please enter a valid card number');
      return false;
    }

    // Basic expiry date validation (MM/YY format)
    const [month, year] = expiryDate.split('/');
    if (!month || !year || parseInt(month) > 12 || parseInt(month) < 1) {
      setError('Please enter a valid expiry date (MM/YY)');
      return false;
    }

    // CVV validation
    if (cvv.length < 3) {
      setError('Please enter a valid CVV');
      return false;
    }

    return true;
  };

  const handleAddMoney = async () => {
    setError(null);
    
    if (!validateCardDetails()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simular un retardo de red
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Guardar el balance
      const saved = await saveBalance(parseFloat(amount));
      
      if (!saved) {
        throw new Error("Failed to save balance");
      }
      
      // Proporcionar feedback háptico en el éxito
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Mostrar alerta de éxito
      Alert.alert(
        "Purchase Successful",
        `You've successfully purchased $${amount} worth of USDC!`,
        [{ 
          text: "OK", 
          onPress: () => {
            // Navegar de vuelta a la pantalla de inicio
            try {
              // Intenta varias opciones de navegación
              try {
                // Opción 1: Usar replace en lugar de push
                router.replace({
                  pathname: "/",
                  params: { newAmount: amount }
                });
              } catch (e) {
                console.log("Error en navegación 1:", e);
                try {
                  // Opción 2: Intentar sin parámetros
                  router.replace("/");
                } catch (e2) {
                  console.log("Error en navegación 2:", e2);
                  // Opción 3: Navegar hacia atrás
                  router.back();
                }
              }
            } catch (navError) {
              console.error("Error durante la navegación:", navError);
              // Último recurso: simplemente volvemos atrás
              router.back();
            }
          } 
        }]
      );
    } catch (err) {
      console.error('Error processing payment:', err);
      setError('Failed to process payment. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Buy USDC with Card</Text>
          <View style={styles.placeholder} />
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
            >
              <Text style={styles.quickAmountText}>{quickAmount}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Card Details */}
        <View style={styles.cardSection}>
          <LinearGradient
            colors={['#8134AF', '#9C27B0']}
            style={styles.cardContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>Card Details</Text>
              <FontAwesome name="credit-card" size={24} color="#fff" />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <TextInput
                style={styles.input}
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 12 }]}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <TextInput
                  style={styles.input}
                  value={expiryDate}
                  onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                  placeholder="MM/YY"
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>

              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.input}
                  value={cvv}
                  onChangeText={setCvv}
                  placeholder="123"
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
          </LinearGradient>
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
            <Text style={styles.addButtonText}>Buy USDC</Text>
          )}
        </TouchableOpacity>

        {/* Botón de debug (puedes eliminar esto en producción) */}
        <TouchableOpacity
          style={styles.debugButton}
          onPress={() => {
            Alert.alert(
              "Debug Info",
              `Wallet Address: ${walletAddress || "None"}\nAmount: ${amount || "0"}`,
              [{ text: "OK" }]
            );
          }}
        >
          <Text style={styles.debugButtonText}>Check Wallet Status</Text>
        </TouchableOpacity>
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
  cardSection: {
    padding: 20,
  },
  cardContainer: {
    padding: 20,
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  row: {
    flexDirection: 'row',
  },
  walletInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 20,
    marginTop: 0,
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
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.7,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  debugButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 20,
    marginTop: 0,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  debugButtonText: {
    color: '#E0E0E0',
    fontSize: 14,
  },
});