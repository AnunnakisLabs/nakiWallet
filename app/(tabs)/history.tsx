import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const TransactionCard = ({ transaction }) => {
  const isIncoming = transaction.type === 'incoming';
  const statusColor = {
    completed: '#4BB543',
    pending: '#FF9800',
    failed: '#FF4B4B',
  }[transaction.status];

  return (
    <TouchableOpacity style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: transaction.userImage }} style={styles.userImage} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{transaction.userName}</Text>
            <Text style={styles.walletAddress}>{transaction.walletAddress}</Text>
            <Text style={styles.transactionDate}>{transaction.date}</Text>
          </View>
        </View>
        <View style={styles.amountContainer}>
          <Text style={[styles.amount, { color: isIncoming ? '#4BB543' : '#FF4B4B' }]}>
            {isIncoming ? '+' : '-'}${transaction.amount}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {transaction.status}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionType}>
          {isIncoming ? 'Payment Received' : 'Payment Sent'}
        </Text>
        {transaction.note && (
          <Text style={styles.transactionNote}>{transaction.note}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const FilterButton = ({ title, active, onPress }) => (
  <TouchableOpacity
    style={[styles.filterButton, active && styles.activeFilterButton]}
    onPress={onPress}
  >
    <Text style={[styles.filterButtonText, active && styles.activeFilterButtonText]}>
      {title}
    </Text>
  </TouchableOpacity>
);

export default function HistoryScreen() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTimeRange, setActiveTimeRange] = useState('all');

  const transactions = [
    {
      id: 1,
      type: 'outgoing',
      amount: '45.00',
      userName: 'Ruben Martinez',
      walletAddress: '0x8765...4321',
      userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
      date: '2 hours ago',
      status: 'completed',
      note: 'Lunch at Cafe Deluxe',
    },
    {
      id: 2,
      type: 'incoming',
      amount: '28.50',
      userName: 'Anouk Graaf',
      walletAddress: '0x9876...5432',
      userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
      date: '5 hours ago',
      status: 'completed',
      note: 'Concert tickets',
    },
    {
      id: 3,
      type: 'outgoing',
      amount: '12.75',
      userName: 'Veronica Chen',
      walletAddress: '0x3456...7890',
      userImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
      date: 'Yesterday',
      status: 'pending',
      note: 'Coffee and pastries',
    },
    {
      id: 4,
      type: 'incoming',
      amount: '95.00',
      userName: 'Pablo Silva',
      walletAddress: '0x2345...6789',
      userImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
      date: 'Yesterday',
      status: 'failed',
      note: 'Project payment',
    },
  ];

  const filteredTransactions = transactions.filter(transaction => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'incoming') return transaction.type === 'incoming';
    if (activeFilter === 'outgoing') return transaction.type === 'outgoing';
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <TouchableOpacity style={styles.filterIcon}>
          <FontAwesome name="sliders" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
        >
          <FilterButton
            title="All"
            active={activeFilter === 'all'}
            onPress={() => setActiveFilter('all')}
          />
          <FilterButton
            title="Incoming"
            active={activeFilter === 'incoming'}
            onPress={() => setActiveFilter('incoming')}
          />
          <FilterButton
            title="Outgoing"
            active={activeFilter === 'outgoing'}
            onPress={() => setActiveFilter('outgoing')}
          />
        </ScrollView>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.timeRangeScroll}
        >
          <FilterButton
            title="All Time"
            active={activeTimeRange === 'all'}
            onPress={() => setActiveTimeRange('all')}
          />
          <FilterButton
            title="This Month"
            active={activeTimeRange === 'month'}
            onPress={() => setActiveTimeRange('month')}
          />
          <FilterButton
            title="This Week"
            active={activeTimeRange === 'week'}
            onPress={() => setActiveTimeRange('week')}
          />
        </ScrollView>
      </View>

      {/* Transactions List */}
      <ScrollView style={styles.transactionsList}>
        {filteredTransactions.map(transaction => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    paddingVertical: 10,
  },
  filtersScroll: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  timeRangeScroll: {
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: '#fff',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  activeFilterButtonText: {
    color: '#8134AF',
  },
  transactionsList: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  walletAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
    fontFamily: Platform.select({
      ios: 'Courier',
      android: 'monospace',
      default: 'monospace',
    }),
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  transactionDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  transactionType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  transactionNote: {
    fontSize: 14,
    color: '#000',
  },
});