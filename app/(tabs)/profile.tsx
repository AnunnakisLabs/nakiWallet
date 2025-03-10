import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { usePrivy, getUserEmbeddedWallet } from '@privy-io/expo';
import * as Clipboard from 'expo-clipboard';

const ProfileAction = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.actionItem} onPress={onPress}>
    <View style={styles.actionIcon}>
      <FontAwesome name={icon} size={20} color="#8134AF" />
    </View>
    <View style={styles.actionContent}>
      <Text style={styles.actionTitle}>{title}</Text>
      {subtitle && <Text style={styles.actionSubtitle}>{subtitle}</Text>}
    </View>
    <FontAwesome name="chevron-right" size={16} color="#666" />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = usePrivy();
  if (!user) {
    return router.push('/');
  }
  const account = getUserEmbeddedWallet(user);
  const userData = {
    name: 'Francisco campos',
    username: '@sasasamaes',
    walletAddress: `${(account?.address || '0x0000...0000').slice(0, 6)}...${(account?.address || '0x0000...0000').slice(-4)}`,
    avatar: 'https://avatars.githubusercontent.com/u/993828?s=400&u=ad62640da5de4fc2433fde838986a6897fe3751a&v=4',
    balance: 1234.56,
  };

  const handleSignOut = () => {
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to sign out?')) {
        router.replace('/');
      }
    } else {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Sign Out',
            style: 'destructive',
            onPress: async () => {
              await logout();
              router.replace('/');
            }
          },
        ],
        { cancelable: true }
      );
    }
  };

  const handleCopyAddress = async () => {
    try {
      await Clipboard.setStringAsync(account?.address || '');
      if (Platform.OS === 'web') {
        alert('Wallet address copied to clipboard!');
      } else {
        Alert.alert('Copied!', 'Wallet address copied to clipboard');
      }
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const recentTransactions = [
    {
      id: 1,
      name: 'Ruben Abarca',
      username: '@espaciofuturoio',
      avatar: 'https://avatars.githubusercontent.com/u/164825567?v=4',
      amount: -45.00,
      date: '2h ago',
      type: 'payment',
      message: '🍽️ Dinner payment',
      walletAddress: '0x8765...4321'
    },
    {
      id: 2,
      name: 'Anouk Rímola',
      username: '@AnoukRImola',
      avatar: 'https://avatars.githubusercontent.com/u/77553677?v=4',
      amount: 28.50,
      date: '5h ago',
      type: 'request',
      message: '🎵 Concert tickets',
      walletAddress: '0x9876...5432'
    },
    {
      id: 3,
      name: 'Pablo Villaplana',
      username: '@PabloVillaplana',
      avatar: 'https://avatars.githubusercontent.com/u/35789725?v=4',
      amount: -12.75,
      date: 'Yesterday',
      type: 'payment',
      message: '☕ Coffee and pastries',
      walletAddress: '0x3456...7890'
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Image source={{ uri: userData.avatar }} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.name}>{userData.name}</Text>
              <Text style={styles.username}>{userData.username}</Text>
              <TouchableOpacity
                style={styles.walletAddressContainer}
                onPress={handleCopyAddress}
              >
                <Text style={styles.walletAddress}>{userData.walletAddress}</Text>
                <FontAwesome name="copy" size={14} color="#E0E0E0" style={styles.copyIcon} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('/edit-profile')}
          >
            <FontAwesome name="pencil" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>${userData.balance.toFixed(2)}</Text>
          <View style={styles.balanceActions}>
            <TouchableOpacity
              style={styles.balanceAction}
              onPress={() => router.push('/income')}
            >
              <FontAwesome name="arrow-up" size={16} color="#4BB543" />
              <Text style={styles.balanceActionText}>Income</Text>
              <Text style={styles.balanceActionAmount}>$3,428.50</Text>
            </TouchableOpacity>
            <View style={styles.balanceActionDivider} />
            <TouchableOpacity
              style={styles.balanceAction}
              onPress={() => router.push('/expenses')}
            >
              <FontAwesome name="arrow-down" size={16} color="#FF4B4B" />
              <Text style={styles.balanceActionText}>Expenses</Text>
              <Text style={styles.balanceActionAmount}>$2,193.94</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Link href="/payment" asChild>
            <TouchableOpacity style={styles.quickAction}>
              <View style={styles.quickActionIcon}>
                <FontAwesome name="paper-plane" size={24} color="#8134AF" />
              </View>
              <Text style={styles.quickActionText}>Send</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/add-money" asChild>
            <TouchableOpacity style={styles.quickAction}>
              <View style={styles.quickActionIcon}>
                <FontAwesome name="plus" size={24} color="#8134AF" />
              </View>
              <Text style={styles.quickActionText}>Add Money</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/history" asChild>
            <TouchableOpacity style={styles.quickAction}>
              <View style={styles.quickActionIcon}>
                <FontAwesome name="history" size={24} color="#8134AF" />
              </View>
              <Text style={styles.quickActionText}>History</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentTransactions.map((transaction) => (
            <TouchableOpacity
              key={transaction.id}
              style={styles.transaction}
              onPress={() => router.push({
                pathname: '/friend-profile',
                params: {
                  name: transaction.name,
                  username: transaction.username,
                  address: transaction.walletAddress,
                  avatar: transaction.avatar
                }
              })}
            >
              <Image
                source={{ uri: transaction.avatar }}
                style={styles.transactionAvatar}
              />
              <View style={styles.transactionInfo}>
                <View style={styles.transactionHeader}>
                  <Text style={styles.transactionName}>{transaction.name}</Text>
                  <Text style={[
                    styles.transactionAmount,
                    { color: transaction.amount < 0 ? '#FF4B4B' : '#4BB543' }
                  ]}>
                    {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                  </Text>
                </View>
                <Text style={styles.transactionAddress}>{transaction.walletAddress}</Text>
                <Text style={styles.transactionMessage}>{transaction.message}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <ProfileAction
            icon="lock"
            title="Security"
            subtitle="2FA, Face ID, Password"
            onPress={() => router.push('/security')}
          />
          <ProfileAction
            icon="bell"
            title="Notifications"
            subtitle="Payment alerts, Messages"
            onPress={() => router.push('/notification-settings')}
          />
          <ProfileAction
            icon="gear"
            title="Preferences"
            subtitle="Language, Currency"
            onPress={() => router.push('/preferences')}
          />
        </View>

        {/* Help & Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Legal</Text>
          <ProfileAction
            icon="question-circle"
            title="FAQ"
            subtitle="Frequently asked questions"
            onPress={() => router.push('/faq')}
          />
          <ProfileAction
            icon="envelope"
            title="Contact Us"
            subtitle="Get support"
            onPress={() => router.push('/contact')}
          />
          <ProfileAction
            icon="file-text"
            title="Terms & Conditions"
            subtitle="Read our terms"
            onPress={() => router.push('/terms')}
          />
          <ProfileAction
            icon="shield"
            title="Privacy Policy"
            subtitle="How we handle your data"
            onPress={() => router.push('/privacy')}
          />
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <FontAwesome name="sign-out" size={20} color="#FF4B4B" />
          <Text style={styles.signOutButtonText}>Sign Out</Text>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#8134AF',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#fff',
  },
  userInfo: {
    marginLeft: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  username: {
    fontSize: 14,
    color: '#E0E0E0',
    marginBottom: 4,
  },
  walletAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  walletAddress: {
    fontSize: 12,
    color: '#E0E0E0',
    fontFamily: Platform.select({
      ios: 'Courier',
      android: 'monospace',
      default: 'monospace',
    }),
    marginRight: 8,
  },
  copyIcon: {
    marginLeft: 4,
  },
  editButton: {
    padding: 8,
  },
  balanceCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 8,
  },
  balanceActions: {
    flexDirection: 'row',
    backgroundColor: '#F8F4FF',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  balanceAction: {
    flex: 1,
    alignItems: 'center',
  },
  balanceActionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  balanceActionAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginTop: 2,
  },
  balanceActionDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 12,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
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
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
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
  transactionMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f8f4ff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  signOutButtonText: {
    color: '#FF4B4B',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});