import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function WalletScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wallet</Text>
      </View>

      <View style={styles.content}>
        <LinearGradient
          colors={['#1e3c72', '#2a5298']}
          style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>USDC Balance</Text>
            <Ionicons name="logo-usd" size={24} color="white" />
          </View>
          <Text style={styles.balance}>$2,458.35</Text>
          <View style={styles.cardActions}>
            <Pressable style={styles.cardAction}>
              <Ionicons name="add-circle-outline" size={20} color="white" />
              <Text style={styles.actionText}>Add</Text>
            </Pressable>
            <Pressable style={styles.cardAction}>
              <Ionicons name="arrow-down-outline" size={20} color="white" />
              <Text style={styles.actionText}>Withdraw</Text>
            </Pressable>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <Pressable style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Ionicons name="swap-horizontal" size={24} color="#2a5298" />
              </View>
              <Text style={styles.actionItemText}>Convert</Text>
              <Text style={styles.actionDescription}>USD to USDC</Text>
            </Pressable>
            <Pressable style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Ionicons name="send" size={24} color="#2a5298" />
              </View>
              <Text style={styles.actionItemText}>Send</Text>
              <Text style={styles.actionDescription}>To wallet</Text>
            </Pressable>
            <Pressable style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Ionicons name="qr-code" size={24} color="#2a5298" />
              </View>
              <Text style={styles.actionItemText}>Receive</Text>
              <Text style={styles.actionDescription}>Show QR</Text>
            </Pressable>
            <Pressable style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Ionicons name="stats-chart" size={24} color="#2a5298" />
              </View>
              <Text style={styles.actionItemText}>History</Text>
              <Text style={styles.actionDescription}>View all</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Accounts</Text>
          <View style={styles.accountItem}>
            <View style={styles.accountIcon}>
              <Ionicons name="card" size={24} color="#2a5298" />
            </View>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>Chase Bank ••••4589</Text>
              <Text style={styles.accountType}>Debit Card</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </View>
        </View>
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
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  balance: {
    color: 'white',
    fontSize: 36,
    fontWeight: '600',
    marginBottom: 20,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  cardAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 12,
  },
  actionText: {
    color: 'white',
    marginLeft: 6,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionItemText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#666',
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
  },
  accountIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  accountType: {
    fontSize: 14,
    color: '#666',
  },
});