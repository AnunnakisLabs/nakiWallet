import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function TransactionDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const {
    type,
    amount,
    fromAddress,
    toAddress,
    time,
    txHash,
    status = 'confirmed',
    network = 'Base Testnet'
  } = params;

  const isReceived = type === 'received';
  const statusColor = {
    confirmed: '#4BB543',
    pending: '#FF9800',
    failed: '#FF4B4B',
  }[status as string] || '#4BB543';
  
  const openExplorerLink = () => {
    // Abrir el hash de la transacción en el explorador de Base Testnet
    const url = `https://sepolia.basescan.org/tx/${txHash}`;
    Linking.openURL(url);
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction Details</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.networkContainer}>
            <View style={styles.networkBadge}>
              <View style={styles.networkDot} />
              <Text style={styles.networkText}>{network}</Text>
            </View>
          </View>
          
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
            </View>
          </View>
          
          <View style={styles.amountContainer}>
            <Text style={[styles.amountLabel, { color: isReceived ? '#4BB543' : '#FF4B4B' }]}>
              {isReceived ? 'Received' : 'Sent'}
            </Text>
            <Text style={[styles.amount, { color: isReceived ? '#4BB543' : '#FF4B4B' }]}>
              {isReceived ? '+' : '-'} ${amount} USDC
            </Text>
          </View>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Transaction Hash</Text>
              <TouchableOpacity onPress={openExplorerLink}>
                <Text style={styles.txHash} numberOfLines={1} ellipsizeMode="middle">
                  {txHash}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date and Time</Text>
              <Text style={styles.infoValue}>{time}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Network</Text>
              <Text style={styles.infoValue}>{network}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>From</Text>
              <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">
                {fromAddress}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>To</Text>
              <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">
                {toAddress}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={[styles.statusValue, { color: statusColor }]}>{status}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.viewOnExplorerButton} onPress={openExplorerLink}>
            <Text style={styles.viewOnExplorerText}>View on Base Explorer</Text>
            <FontAwesome name="external-link" size={16} color="#8134AF" />
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
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
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
  networkContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 82, 255, 0.1)',
  },
  networkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0052FF',
    marginRight: 6,
  },
  networkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0052FF',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  amountLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  txHash: {
    fontSize: 16,
    color: '#8134AF',
    fontFamily: Platform.select({
      ios: 'Courier',
      android: 'monospace',
      default: 'monospace',
    }),
  },
  addressText: {
    fontSize: 16,
    color: '#333',
    fontFamily: Platform.select({
      ios: 'Courier',
      android: 'monospace',
      default: 'monospace',
    }),
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  viewOnExplorerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#f8f4ff',
    borderRadius: 10,
  },
  viewOnExplorerText: {
    fontSize: 16,
    color: '#8134AF',
    fontWeight: '600',
    marginRight: 8,
  },
}); 