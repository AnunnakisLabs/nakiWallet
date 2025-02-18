import React, { forwardRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

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

const QuickAction = forwardRef(({ icon, title, onPress }, ref) => (
  <TouchableOpacity ref={ref} style={styles.quickAction} onPress={onPress}>
    <View style={styles.quickActionIcon}>
      <FontAwesome name={icon} size={24} color="#8134AF" />
    </View>
    <Text style={styles.quickActionText}>{title}</Text>
  </TouchableOpacity>
));

QuickAction.displayName = 'QuickAction';

export default function HomeScreen() {
  const router = useRouter();
  
  const user = {
    firstName: 'Francisco',
    lastName: 'Campos Diaz',
    username: '@sasasamaes',
    avatar: 'https://avatars.githubusercontent.com/u/993828?s=400&u=ad62640da5de4fc2433fde838986a6897fe3751a&v=4',
    walletAddress: '0x1234...5678'
  };

  const walletData = {
    totalBalance: 3250.00,
    coin: { 
      symbol: 'USDC', 
      name: 'USD Coin', 
      balance: 3250.00, 
      price: 1.00 
    },
    recentTransactions: [
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
        type: 'sent',
        amount: 200,
        to: 'Pedro A. González',
        toAddress: '0x9876...5432',
        avatar: 'https://avatars.githubusercontent.com/u/14959399?v=4',
        message: '🍽️ Dinner split',
        time: '5h ago'
      },
      {
        id: 3,
        type: 'received',
        amount: 1000,
        from: 'Veronica Jiménez',
        fromAddress: '0x3456...7890',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
        message: '💼 Project payment',
        time: 'Yesterday'
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Link href="/profile" asChild>
            <TouchableOpacity style={styles.profileSection}>
              <Image 
                source={{ uri: user.avatar }} 
                style={styles.profileAvatar} 
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {user.firstName} {user.lastName}
                </Text>
                <View style={styles.profileDetails}>
                  <Text style={styles.profileUsername}>{user.username}</Text>
                  <Text style={styles.walletAddress}>{user.walletAddress}</Text>
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
          <Text style={styles.balance}>${walletData.totalBalance.toFixed(2)}</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Link href="/payment" asChild>
            <QuickAction icon="paper-plane" title="Send" />
          </Link>
          <Link href="/payment" asChild>
            <QuickAction icon="download" title="Receive" />
          </Link>
          <Link href="/add-money" asChild>
            <QuickAction icon="plus" title="Add Money" />
          </Link>
          <Link href="/history" asChild>
            <QuickAction icon="history" title="History" />
          </Link>
        </View>

        {/* USDC Balance */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Balance</Text>
          </View>
          <CoinBalance {...walletData.coin} />
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
          {walletData.recentTransactions.map((tx) => (
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
    width: 40,
    height: 40,
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