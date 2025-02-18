import React from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function FriendProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { name, username, address, avatar } = params;

  const recentTransactions = [
    { 
      id: 1, 
      type: 'received',
      amount: 500,
      from: 'Alice Johnson',
      fromAddress: '0x8765...4321',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
      message: '🎨 Commission payment',
      time: '2h ago'
    },
    { 
      id: 2, 
      type: 'sent',
      amount: 200,
      to: 'Bob Smith',
      toAddress: '0x9876...5432',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
      message: '🍽️ Dinner split',
      time: '5h ago'
    },
  ];

  const handlePayment = (type: 'send' | 'request') => {
    router.push({
      pathname: '/payment',
      params: {
        name: name as string,
        username: username as string,
        address: address as string,
        avatar: avatar as string,
        type
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: avatar as string }} 
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{name as string}</Text>
          <Text style={styles.profileUsername}>{username as string}</Text>
          <Text style={styles.profileAddress}>{address as string}</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.sendButton]}
              onPress={() => handlePayment('send')}
            >
              <FontAwesome name="paper-plane" size={16} color="#fff" />
              <Text style={styles.actionButtonText}>Send Money</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.requestButton]}
              onPress={() => handlePayment('request')}
            >
              <FontAwesome name="download" size={16} color="#fff" />
              <Text style={styles.actionButtonText}>Request</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          {recentTransactions.map((tx) => (
            <View key={tx.id} style={styles.transaction}>
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
            </View>
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
  profileSection: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  profileUsername: {
    fontSize: 16,
    color: '#E0E0E0',
    marginBottom: 8,
  },
  profileAddress: {
    fontSize: 14,
    color: '#E0E0E0',
    fontFamily: Platform.select({
      ios: 'Courier',
      android: 'monospace',
      default: 'monospace',
    }),
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  sendButton: {
    backgroundColor: '#9C27B0',
  },
  requestButton: {
    backgroundColor: '#5B2C8D',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
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
  transactionTime: {
    fontSize: 12,
    color: '#999',
  },
});