import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PaymentMethod = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.paymentMethod} onPress={onPress}>
    <View style={styles.paymentIcon}>
      <FontAwesome name={icon} size={24} color="#8134AF" />
    </View>
    <View style={styles.paymentInfo}>
      <Text style={styles.paymentTitle}>{title}</Text>
      <Text style={styles.paymentSubtitle}>{subtitle}</Text>
    </View>
    <FontAwesome name="chevron-right" size={16} color="#666" />
  </TouchableOpacity>
);

export default function AddMoneyScreen() {
  const router = useRouter();

  const navigateToPaymentMethod = (method) => {
    if (method === 'debit') {
      router.push('/add-money-debit');
    } else if (method === 'paypal') {
      router.push('/add-money-paypal');
    } else if (method === 'bank') {
      router.push('/add-money-bank');
    } else if (method === 'crypto') {
      router.push('/add-money-crypto');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Money</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoContainer}>
          <FontAwesome name="info-circle" size={24} color="#fff" />
          <Text style={styles.infoText}>
            Add USDC to your wallet using one of these payment methods. Funds will be available in your balance immediately.
          </Text>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentMethodsContainer}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          
          <PaymentMethod
            icon="credit-card"
            title="Debit/Credit Card"
            subtitle="Add money using your debit or credit card via MoonPay"
            onPress={() => navigateToPaymentMethod('debit')}
          />
          
          <PaymentMethod
            icon="paypal"
            title="PayPal"
            subtitle="Connect your PayPal account to add money via MoonPay"
            onPress={() => navigateToPaymentMethod('paypal')}
          />
          
          <PaymentMethod
            icon="bank"
            title="Bank Transfer"
            subtitle="Add money using ACH or wire transfer via MoonPay"
            onPress={() => navigateToPaymentMethod('bank')}
          />
          
          <PaymentMethod
            icon="bitcoin"
            title="Cryptocurrency"
            subtitle="Deposit using Bitcoin, Ethereum, USDC, or other cryptocurrencies"
            onPress={() => navigateToPaymentMethod('crypto')}
          />
        </View>

        {/* Recent Transactions */}
        <View style={styles.recentTransactionsContainer}>
          <Text style={styles.sectionTitle}>Recent Deposits</Text>
          
          <View style={styles.transaction}>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>Bank Transfer</Text>
              <Text style={styles.transactionDate}>Yesterday</Text>
            </View>
            <Text style={styles.transactionAmount}>+$500.00</Text>
          </View>

          <View style={styles.transaction}>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>Debit Card</Text>
              <Text style={styles.transactionDate}>3 days ago</Text>
            </View>
            <Text style={styles.transactionAmount}>+$200.00</Text>
          </View>
        </View>

        <View style={styles.helpContainer}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpText}>
            If you're having trouble adding money to your account, please contact our support team for assistance.
          </Text>
          <TouchableOpacity style={styles.supportButton}>
            <FontAwesome name="headphones" size={16} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  paymentMethodsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginBottom: 12,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0E6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
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
  paymentSubtitle: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  recentTransactionsContainer: {
    backgroundColor: '#fff',
    padding: 20,
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4BB543',
  },
  helpContainer: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 10,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  supportButton: {
    backgroundColor: '#8134AF',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 8,
  },
});