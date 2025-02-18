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
    <View style={styles.paymentMethodIcon}>
      <FontAwesome name={icon} size={24} color="#8134AF" />
    </View>
    <View style={styles.paymentMethodInfo}>
      <Text style={styles.paymentMethodTitle}>{title}</Text>
      <Text style={styles.paymentMethodSubtitle}>{subtitle}</Text>
    </View>
    <FontAwesome name="chevron-right" size={16} color="#666" />
  </TouchableOpacity>
);

export default function AddMoneyScreen() {
  const router = useRouter();

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
        {/* Payment Methods */}
        <View style={styles.paymentMethodsContainer}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          
          <PaymentMethod
            icon="credit-card"
            title="Debit Card"
            subtitle="Instant deposit"
            onPress={() => router.push('/add-money-debit')}
          />
          
          <PaymentMethod
            icon="bank"
            title="Bank Transfer"
            subtitle="1-3 business days"
            onPress={() => router.push('/add-money-bank')}
          />
          
          <PaymentMethod
            icon="paypal"
            title="PayPal"
            subtitle="Instant deposit"
            onPress={() => router.push('/add-money-paypal')}
          />
          
          <PaymentMethod
            icon="bitcoin"
            title="Cryptocurrency"
            subtitle="BTC, ETH, USDT"
            onPress={() => router.push('/add-money-crypto')}
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
  paymentMethodsContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginTop: 20,
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
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  paymentMethodIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  paymentMethodSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
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
});