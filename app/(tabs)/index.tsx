import React, { forwardRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import { usePrivy, getUserEmbeddedWallet } from '@privy-io/expo';
import useBlockchain from '@/hooks/useBlockchain'; 

const CoinBalance = ({ symbol, name, balance, price }) => (
  <TouchableOpacity style={styles.coinCard}>
    <View style={styles.coinHeader}>
      <View style={styles.coinInfo}>
        <View style={[styles.coinIcon, { backgroundColor: '#2775CA20' }]}>
          <Text style={[styles.coinSymbol, { color: '#2775CA' }]}>{symbol}</Text>
        </View>
        <View>
          <Text style={styles.coinName}>{name}</Text>
          <Text style={styles.coinPrice}>${price.toFixed(2)} USD</Text>
        </View>
      </View>
      <View style={styles.coinBalanceContainer}>
        <Text style={styles.coinBalance}>${balance.toFixed(2)}</Text>
      </View>
    </View>
  </TouchableOpacity>
);


interface QuickActionProps {
  icon: string;
  title: string;
  onPress?: () => void;
}

const QuickAction = forwardRef<TouchableOpacity, QuickActionProps>(
  ({ icon, title, onPress }, ref) => (
    <TouchableOpacity ref={ref} style={styles.quickAction} onPress={onPress}>
      <View style={styles.quickActionIcon}>
        <FontAwesome name={icon} size={24} color="#8134AF" />
      </View>
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  )
);

QuickAction.displayName = 'QuickAction';

export default function HomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, isReady } = usePrivy();
  
  const { 
    balance, 
    refreshBalance, 
    getTransactionHistory, 
    isLoading: blockchainLoading 
  } = useBlockchain();
  
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    avatar: 'https://avatars.githubusercontent.com/u/993828?s=400&u=ad62640da5de4fc2433fde838986a6897fe3751a&v=4',
    walletAddress: '',
  });
  
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (params?.refreshTimestamp || params?.newAmount) {
    loadUserData();
    loadTransactions();
  }
}, [params]);

  useEffect(() => {
    if (isReady && user) {
      loadAllData();
    }
  }, [isReady, user]);

  const loadAllData = async () => {
    setLoading(true);
    
    try {
      await refreshBalance();
      await loadTransactions();
      await loadUserData();
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const transactions = await getTransactionHistory();
      
      if (transactions && transactions.length > 0) {
        setRecentTransactions(transactions);
      } else {
        setRecentTransactions([
          {
            id: 1,
            type: 'received',
            amount: 500,
            from: 'Ruben Abarca',
            fromAddress: '0x8765...4321',
            avatar: 'https://avatars.githubusercontent.com/u/164825567?v=4',
            message: '🎨 Commission payment',
            time: '2h ago'
          },
       
          {
            id: 2,
            type: 'received',
            amount: 28.50,
            from: 'Anouk Rímola',
            fromAddress: '0x9876...5432',
            avatar: 'https://avatars.githubusercontent.com/u/77553677?v=4',
            message: '💼 Project payment',
            time: '5 hours ago'
          },
          {
            id: 3,
            type: 'sent',
            amount: 200,
            to: 'Pedro A. González',
            toAddress: '0x9876...5432',
            avatar: 'https://avatars.githubusercontent.com/u/14959399?v=4',
            message: '🍽️ Dinner split',
            time: '5h ago'
          },
        ]);
      }
    } catch (err) {
      console.error('Error loading transactions:', err);
    }
  };

  const loadUserData = async () => {
    try {
      if (!user) return;
      
      const wallet = getUserEmbeddedWallet(user);
      
      let email = '';
      const emailAccount = user.linked_accounts.find(account => account.type === 'email');
      if (emailAccount && 'address' in emailAccount) {
        email = emailAccount.address;
      }
      
      const extractNameFromEmail = (email: string) => {
        if (!email) return { firstName: 'User', lastName: '' };
        
        const namePart = email.split('@')[0];
        
        if (namePart.includes('.')) {
          const [first, last] = namePart.split('.');
          return {
            firstName: first.charAt(0).toUpperCase() + first.slice(1),
            lastName: last.charAt(0).toUpperCase() + last.slice(1)
          };
        }
        
        return {
          firstName: namePart.charAt(0).toUpperCase() + namePart.slice(1),
          lastName: ''
        };
      };
      
      const { firstName, lastName } = extractNameFromEmail(email);
      
      const formatWalletAddress = (address: string | undefined) => {
        if (!address) return '';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
      };
      
      setUserData({
        firstName,
        lastName,
        username: `@${firstName.toLowerCase()}${lastName ? lastName.toLowerCase() : ''}`,
        avatar: 'https://avatars.githubusercontent.com/u/993828?s=400&u=ad62640da5de4fc2433fde838986a6897fe3751a&v=4', // Avatar por defecto
        walletAddress: formatWalletAddress(wallet?.address || '')
      });
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  };

  if ((loading || blockchainLoading) && !userData.firstName) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading wallet data...</Text>
      </SafeAreaView>
    );
  }

  const checkForNewTransaction = () => {
    if (params?.newAmount && !isNaN(parseFloat(params.newAmount as string))) {
      const amount = parseFloat(params.newAmount as string);
      
      const newTransaction = {
        id: Date.now(),
        type: 'received',
        amount: amount,
        from: 'Card Purchase',
        fromAddress: '0x0000...0000',
        avatar: 'https://cdn-icons-png.flaticon.com/512/147/147258.png',
        message: '💳 USDC Purchase',
        time: 'Just now'
      };
      
      return [newTransaction, ...recentTransactions.slice(0, 2)];
    }
    
    return recentTransactions;
  };

  const displayTransactions = checkForNewTransaction();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Link href="/profile" asChild>
            <TouchableOpacity style={styles.profileSection}>
              <Image 
                source={{ uri: userData.avatar }} 
                style={styles.profileAvatar} 
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {userData.firstName} {userData.lastName}
                </Text>
                <View style={styles.profileDetails}>
                  <Text style={styles.profileUsername}>{userData.username}</Text>
                  <Text style={styles.walletAddress}>{userData.walletAddress}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
          <Link href="/notifications" asChild>
            <TouchableOpacity style={styles.notificationButton}>
              <FontAwesome name="bell" size={24} color="#fff" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </Link>
        </View>

        {/* Balance Section */}
        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          {blockchainLoading ? (
            <View style={styles.balanceLoading}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.balanceLoadingText}>Updating...</Text>
            </View>
          ) : (
            <Text style={styles.balance}>${balance.toFixed(2)}</Text>
          )}
          <View style={styles.networkInfo}>
            <Text style={styles.networkText}>Base Testnet</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Link href="/payment" asChild>
            <QuickAction icon="paper-plane" title="Send" />
          </Link>
          <Link href="/receive-money" asChild>
            <QuickAction icon="download" title="Receive" />
          </Link>
          <Link href="/add-money" asChild>
            <QuickAction icon="plus" title="Add Money" />
          </Link>
          <Link href="../history" asChild>
            <QuickAction icon="history" title="History" />
          </Link>
        </View>


        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <Link href="/history" asChild>
              <TouchableOpacity>
                <Text style={styles.sectionAction}>See All</Text>
              </TouchableOpacity>
            </Link>
          </View>
          {displayTransactions.map((tx: any) => (
            <TouchableOpacity 
              key={tx.id} 
              style={styles.transaction}
              onPress={() => router.push({
                pathname: '/friend-profile',
                params: {
                  name: tx.type === 'received' ? tx.from : tx.to,
                  username: `@${(tx.type === 'received' ? tx.from : tx.to).toLowerCase().replace(' ', '')}`,
                  address: tx.type === 'received' ? tx.fromAddress : tx.toAddress,
                  avatar: tx.avatar
                }
              })}
            >
              <Image 
                source={{ uri: tx.avatar }} 
                style={styles.transactionAvatar}
              />
              <View style={styles.transactionInfo}>
                <View style={styles.transactionHeader}>
                  <Text style={styles.transactionName}>
                    {tx.type === 'received' ? tx.from : tx.to}
                  </Text>
                  <Text style={[
                    styles.transactionValue,
                    { color: tx.type === 'received' ? '#4BB543' : '#FF4B4B' }
                  ]}>
                    {tx.type === 'received' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </Text>
                </View>
                <Text style={styles.transactionAddress}>
                  {tx.type === 'received' ? tx.fromAddress : tx.toAddress}
                </Text>
                <Text style={styles.transactionMessage}>{tx.message}</Text>
                <Text style={styles.transactionTime}>{tx.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    marginLeft: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  profileUsername: {
    fontSize: 12,
    color: '#E0E0E0',
    marginBottom: 2,
  },
  balanceSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  balanceLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  balanceLoadingText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  networkInfo: {
    marginTop: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  networkText: {
    color: '#E0E0E0',
    fontSize: 12,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4B4B',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    marginTop: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  sectionAction: {
    fontSize: 14,
    color: '#8134AF',
    fontWeight: '600',
  },
  coinCard: {
    backgroundColor: '#F8F4FF',
    borderRadius: 12,
    padding: 15,
  },
  coinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  coinSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  coinName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  coinPrice: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  coinBalanceContainer: {
    alignItems: 'flex-end',
  },
  coinBalance: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  transactionValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  transactionTime: {
    fontSize: 12,
    color: '#999',
  },
  profileDetails: {
    flexDirection: 'column',
  },
  walletAddress: {
    fontSize: 11,
    color: '#E0E0E0',
    fontFamily: Platform.select({
      ios: 'Courier',
      android: 'monospace',
      default: 'monospace',
    }),
  },
  transactionAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Courier',
      android: 'monospace',
      default: 'monospace',
    }),
  },
});