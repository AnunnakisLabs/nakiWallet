import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useBlockchain from '@/hooks/useBlockchain';

const TransactionCard = ({ transaction, onPress }) => {
  const isIncoming = transaction.type === 'received';
  const statusColor = {
    confirmed: '#4BB543',
    pending: '#FF9800',
    failed: '#FF4B4B',
  }[transaction.status || 'confirmed'];

  // Elegir un avatar según el tipo
  const getAvatar = (type, address) => {
    // Usar una seed basada en la dirección para consistencia
    const seed = parseInt(address.slice(2, 10), 16) % 100;
    if (type === 'received') {
      return `https://avatars.dicebear.com/api/bottts/${seed}.svg`;
    }
    return `https://avatars.dicebear.com/api/identicon/${seed}.svg`;
  };

  // Si no hay imagen de usuario, generar una basada en la dirección
  const userImage = transaction.userImage || 
    getAvatar(transaction.type, transaction.type === 'received' ? 
      transaction.fromAddress : transaction.toAddress);

  return (
    <TouchableOpacity style={styles.transactionCard} onPress={() => onPress(transaction)}>
      <View style={styles.transactionHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: userImage }} style={styles.userImage} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>
              {transaction.userName || (isIncoming ? 'Received USDC' : 'Sent USDC')}
            </Text>
            <Text style={styles.walletAddress}>
              {isIncoming ? transaction.fromAddress : transaction.toAddress}
            </Text>
            <Text style={styles.transactionDate}>{transaction.date || transaction.time}</Text>
          </View>
        </View>
        <View style={styles.amountContainer}>
          <Text style={[styles.amount, { color: isIncoming ? '#4BB543' : '#FF4B4B' }]}>
            {isIncoming ? '+' : '-'}${typeof transaction.amount === 'number' ? 
              transaction.amount.toFixed(2) : transaction.amount}
          </Text>
          <View style={styles.networkBadge}>
            <Text style={styles.networkText}>Base Testnet</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {transaction.status || 'confirmed'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionType}>
          {isIncoming ? 'Payment Received' : 'Payment Sent'}
        </Text>
        {transaction.txHash && (
          <Text style={styles.txHash} numberOfLines={1} ellipsizeMode="middle">
            TX: {transaction.txHash}
          </Text>
        )}
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
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { getTransactionHistory, isLoading: blockchainLoading } = useBlockchain();

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const blockchainTransactions = await getTransactionHistory();
      
      // Formatear transacciones para la UI
      if (blockchainTransactions && blockchainTransactions.length > 0) {
        const formattedTransactions = blockchainTransactions.map(tx => {
          // Calcular una representación amigable del tiempo
          const getTimeString = (timestamp) => {
            const now = Date.now();
            const diff = now - timestamp;
            
            if (diff < 60000) return 'Just now';
            if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
            if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
            if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;
            return new Date(timestamp).toLocaleDateString();
          };
          
          return {
            id: tx.id || tx.txHash,
            type: tx.type,
            amount: tx.amount,
            fromAddress: tx.fromAddress,
            toAddress: tx.toAddress,
            time: getTimeString(tx.timestamp),
            date: getTimeString(tx.timestamp),
            status: tx.status || 'confirmed',
            note: tx.isSimulated ? '💡 Simulated transaction' : '',
            txHash: tx.txHash,
            network: 'Base Testnet'
          };
        });
        
        setTransactions(formattedTransactions);
      } else {
        // Datos de muestra como fallback
        setTransactions([
          {
            id: 1,
            type: 'received',
            amount: '500',
            userName: 'Ruben Abarca',
            fromAddress: '0x8765...4321',
            toAddress: 'Your wallet',
            userImage: 'https://avatars.githubusercontent.com/u/164825567?v=4',
            date: '2 hours ago',
            status: 'confirmed',
            note: '🎨 Commission payment',
            network: 'Base Testnet'
          },
          {
            id: 2,
            type: 'received',
            amount: '28.50',
            userName: 'Anouk Rímola',
            fromAddress: '0x9876...5432',
            toAddress: 'Your wallet',
            userImage: 'https://avatars.githubusercontent.com/u/77553677?v=4',
            date: '5 hours ago',
            status: 'confirmed',
            note: '💼 Project payment',
            network: 'Base Testnet'
          },
          {
            id: 3,
            type: 'outgoing',
            amount: '200',
            userName: 'Pedro A. González',
            fromAddress: 'Your wallet',
            toAddress: '0x9876...5432',
            userImage: 'https://avatars.githubusercontent.com/u/14959399?v=4',
            date: '5h ago',
            status: 'pending',
            note: '🍽️ Dinner split',
            network: 'Base Testnet'
          },
          {
            id: 4,
            type: 'received',
            amount: '95.00',
            userName: 'Pablo Villaplana',
            fromAddress: '0x2345...6789',
            toAddress: 'Your wallet',
            userImage: 'https://avatars.githubusercontent.com/u/35789725?v=4',
            date: 'Yesterday',
            status: 'failed',
            note: 'Project payment',
            network: 'Base Testnet'
          },
        ]);
      }
    } catch (error) {
      console.error('Error loading transaction history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionPress = (transaction) => {
    // Navegar a los detalles de la transacción
    if (transaction.txHash) {
      router.push({
        pathname: "./transaction-details" as any,
        params: {
          type: transaction.type,
          amount: transaction.amount.toString(),
          fromAddress: transaction.fromAddress,
          toAddress: transaction.toAddress,
          time: transaction.time || transaction.date,
          txHash: transaction.txHash,
          status: transaction.status,
          network: transaction.network || 'Base Testnet'
        }
      });
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'incoming') return transaction.type === 'received';
    if (activeFilter === 'outgoing') return transaction.type === 'outgoing' || transaction.type === 'sent';
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

      {/* Header de Red */}
      <View style={styles.networkHeader}>
        <View style={styles.networkHeaderBadge}>
          <View style={styles.networkDot} />
          <Text style={styles.networkHeaderText}>Base Testnet</Text>
        </View>
        <Text style={styles.networkDescription}>Visualizando transacciones en la red de prueba de Base</Text>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          <FilterButton
            title="All"
            active={activeFilter === 'all'}
            onPress={() => setActiveFilter('all')}
          />
          <FilterButton
            title="Received"
            active={activeFilter === 'incoming'}
            onPress={() => setActiveFilter('incoming')}
          />
          <FilterButton
            title="Sent"
            active={activeFilter === 'outgoing'}
            onPress={() => setActiveFilter('outgoing')}
          />
        </ScrollView>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.timeRangeScroll}
          contentContainerStyle={styles.filtersContent}
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
      {loading || blockchainLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      ) : (
        <ScrollView style={styles.transactionsList}>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map(transaction => (
              <TransactionCard 
                key={transaction.id} 
                transaction={transaction} 
                onPress={handleTransactionPress}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No transactions found</Text>
              <Text style={styles.emptyStateSubtext}>Transactions will appear here as you send or receive USDC</Text>
            </View>
          )}
        </ScrollView>
      )}
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
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  networkHeader: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  networkHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4BB543',
    marginRight: 6,
  },
  networkHeaderText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  networkDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 4,
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
  filtersContent: {
    paddingRight: 10,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
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
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#999',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  networkBadge: {
    backgroundColor: 'rgba(0, 82, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 4,
  },
  networkText: {
    fontSize: 10,
    color: '#0052FF',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
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
  },
  transactionDetails: {
    marginTop: 10,
    paddingTop: 10,
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
    color: '#333',
  },
  txHash: {
    fontSize: 12,
    color: '#8134AF',
    marginVertical: 4,
    fontFamily: Platform.select({
      ios: 'Courier',
      android: 'monospace',
      default: 'monospace',
    }),
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});