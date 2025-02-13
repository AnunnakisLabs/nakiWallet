import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

type Transaction = {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  amount: number;
  type: 'sent' | 'received';
  description: string;
  timestamp: string;
};

const transactions: Transaction[] = [
  {
    id: '1',
    user: {
      name: 'Sarah Wilson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
    amount: 25.50,
    type: 'received',
    description: 'Lunch at Chipotle',
    timestamp: '2h ago',
  },
  {
    id: '2',
    user: {
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    },
    amount: 55.00,
    type: 'sent',
    description: 'Concert tickets',
    timestamp: '5h ago',
  },
  // Add more transactions as needed
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#1e3c72', '#2a5298']}
        style={styles.header}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Your Balance</Text>
          <Text style={styles.balanceAmount}>$2,458.35 USDC</Text>
        </View>
        <View style={styles.actionsContainer}>
          <Pressable style={styles.actionButton}>
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text style={styles.actionText}>Add</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Ionicons name="swap-horizontal-outline" size={24} color="white" />
            <Text style={styles.actionText}>Convert</Text>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Ionicons name="arrow-down-outline" size={24} color="white" />
            <Text style={styles.actionText}>Withdraw</Text>
          </Pressable>
        </View>
      </LinearGradient>

      <View style={styles.transactionsContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {transactions.map((transaction) => (
          <View key={transaction.id} style={styles.transaction}>
            <Image
              source={{ uri: transaction.user.avatar }}
              style={styles.avatar}
            />
            <View style={styles.transactionDetails}>
              <Text style={styles.userName}>{transaction.user.name}</Text>
              <Text style={styles.description}>{transaction.description}</Text>
              <Text style={styles.timestamp}>{transaction.timestamp}</Text>
            </View>
            <Text
              style={[
                styles.amount,
                transaction.type === 'received'
                  ? styles.received
                  : styles.sent,
              ]}>
              {transaction.type === 'received' ? '+' : '-'}${transaction.amount}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginBottom: 8,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 32,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    marginTop: 8,
  },
  transactionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    color: '#666',
    marginTop: 4,
  },
  timestamp: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  received: {
    color: '#2ecc71',
  },
  sent: {
    color: '#e74c3c',
  },
});