import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function StorePaymentScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quickAmounts = ['$5', '$10', '$20', '$50', '$100'];

  const handlePayment = async () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success message
      if (Platform.OS === 'web') {
        alert(`Payment of $${amount} successful!`);
      } else {
        Alert.alert('Success', `Payment of $${amount} successful!`);
      }

      // Reset form
      setAmount('');
      setNote('');
      
      // Navigate back
      router.back();
    } catch (error) {
      setError('Payment failed. Please try again.');
    } finally {
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
          <Text style={styles.headerTitle}>Store Payment</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentMethods}>
          <TouchableOpacity 
            style={styles.paymentMethod}
            onPress={() => router.push('/qr')}
          >
            <LinearGradient
              colors={['#8134AF', '#9C27B0']}
              style={styles.paymentMethodGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FontAwesome name="qrcode" size={32} color="#fff" />
              <Text style={styles.paymentMethodTitle}>Scan QR Code</Text>
              <Text style={styles.paymentMethodDescription}>
                Scan store's QR code to pay
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.paymentMethod}
            onPress={() => router.push('/nfc-payment')}
          >
            <LinearGradient
              colors={['#5B2C8D', '#8134AF']}
              style={styles.paymentMethodGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FontAwesome name="wifi" size={32} color="#fff" />
              <Text style={styles.paymentMethodTitle}>NFC Payment</Text>
              <Text style={styles.paymentMethodDescription}>
                Tap your phone to pay
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Manual Payment */}
        <View style={styles.manualPayment}>
          <Text style={styles.sectionTitle}>Manual Payment</Text>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Amount Input */}
          <View style={styles.amountContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              placeholderTextColor="#B39DDB"
            />
          </View>

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

          {/* Note Input */}
          <View style={styles.noteContainer}>
            <FontAwesome name="pencil" size={20} color="#666" style={styles.noteIcon} />
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="Add a note (optional)"
              placeholderTextColor="#666"
            />
          </View>

          {/* Pay Button */}
          <TouchableOpacity
            style={[styles.payButton, isLoading && styles.payButtonDisabled]}
            onPress={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.payButtonText}>Pay Now</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Recent Store Payments */}
        <View style={styles.recentPayments}>
          <Text style={styles.sectionTitle}>Recent Store Payments</Text>
          
          <View style={styles.payment}>
            <View style={styles.paymentIcon}>
              <FontAwesome name="coffee" size={20} color="#8134AF" />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Coffee Shop</Text>
              <Text style={styles.paymentDate}>Today, 10:30 AM</Text>
            </View>
            <Text style={styles.paymentAmount}>-$4.50</Text>
          </View>

          <View style={styles.payment}>
            <View style={styles.paymentIcon}>
              <FontAwesome name="shopping-cart" size={20} color="#8134AF" />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Grocery Store</Text>
              <Text style={styles.paymentDate}>Yesterday</Text>
            </View>
            <Text style={styles.paymentAmount}>-$65.20</Text>
          </View>

          <View style={styles.payment}>
            <View style={styles.paymentIcon}>
              <FontAwesome name="cutlery" size={20} color="#8134AF" />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Restaurant</Text>
              <Text style={styles.paymentDate}>2 days ago</Text>
            </View>
            <Text style={styles.paymentAmount}>-$32.80</Text>
          </View>
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
  paymentMethods: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  paymentMethod: {
    flex: 1,
  },
  paymentMethodGradient: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
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
  paymentMethodTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  paymentMethodDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    textAlign: 'center',
  },
  manualPayment: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 75, 75, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#FF4B4B',
    fontSize: 14,
    textAlign: 'center',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dollarSign: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#8134AF',
    marginRight: 4,
  },
  amountInput: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#8134AF',
    minWidth: 150,
    textAlign: 'center',
  },
  quickAmountsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  quickAmountButton: {
    backgroundColor: '#F8F4FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickAmountText: {
    color: '#8134AF',
    fontSize: 16,
    fontWeight: '500',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  noteIcon: {
    padding: 10,
  },
  noteInput: {
    flex: 1,
    height: 50,
    color: '#000',
    fontSize: 16,
  },
  payButton: {
    backgroundColor: '#8134AF',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  recentPayments: {
    backgroundColor: '#fff',
    padding: 20,
  },
  payment: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: 12,
    color: '#666',
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4B4B',
  },
});