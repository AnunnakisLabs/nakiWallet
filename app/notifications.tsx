import React, { useState } from 'react';
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

const NotificationItem = ({ type, title, message, time, read, onPress }) => {
  const getIcon = () => {
    switch (type) {
      case 'payment':
        return 'dollar';
      case 'transfer':
        return 'exchange';
      case 'security':
        return 'shield';
      case 'reward':
        return 'gift';
      default:
        return 'bell';
    }
  };

  const getIconBackground = () => {
    switch (type) {
      case 'payment':
        return '#4BB543';
      case 'transfer':
        return '#FF9800';
      case 'security':
        return '#FF4B4B';
      case 'reward':
        return '#FFD700';
      default:
        return '#8134AF';
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.notification, !read && styles.unreadNotification]}
      onPress={onPress}
    >
      <View style={[styles.notificationIcon, { backgroundColor: getIconBackground() }]}>
        <FontAwesome name={getIcon()} size={20} color="#fff" />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{title}</Text>
        <Text style={styles.notificationMessage}>{message}</Text>
        <Text style={styles.notificationTime}>{time}</Text>
      </View>
      {!read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');

  const notifications = [
    {
      id: 1,
      type: 'payment',
      title: 'Payment Received',
      message: 'You received $28.50 from Anouk Rímola',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      type: 'transfer',
      title: 'Transfer Completed',
      message: 'Your transfer of $45.00 to Ruben Abarca was successful',
      time: '5 hours ago',
      read: false,
    },
    {
      id: 3,
      type: 'security',
      title: 'Security Alert',
      message: 'New device logged into your account',
      time: 'Yesterday',
      read: true,
    },
    {
      id: 4,
      type: 'payment',
      title: 'Payment Request',
      message: 'Pablo Villaplana requested $95.00',
      time: 'Yesterday',
      read: true,
    },
    {
      id: 5,
      type: 'transfer',
      title: 'Transfer Failed',
      message: 'Your transfer to Bank Account ****4523 failed',
      time: '2 days ago',
      read: true,
    },
    {
      id: 6,
      type: 'reward',
      title: 'Reward Earned',
      message: 'You earned 500 points from your recent transactions',
      time: '3 days ago',
      read: true,
    },
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.read;
    if (activeFilter === 'payments') return notification.type === 'payment';
    if (activeFilter === 'security') return notification.type === 'security';
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => router.push('/notification-settings')}
        >
          <FontAwesome name="cog" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          <TouchableOpacity 
            style={[styles.filterTab, activeFilter === 'all' && styles.activeFilterTab]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.filterText, activeFilter === 'all' && styles.activeFilterText]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterTab, activeFilter === 'unread' && styles.activeFilterTab]}
            onPress={() => setActiveFilter('unread')}
          >
            <Text style={[styles.filterText, activeFilter === 'unread' && styles.activeFilterText]}>
              Unread
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterTab, activeFilter === 'payments' && styles.activeFilterTab]}
            onPress={() => setActiveFilter('payments')}
          >
            <Text style={[styles.filterText, activeFilter === 'payments' && styles.activeFilterText]}>
              Payments
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterTab, activeFilter === 'security' && styles.activeFilterTab]}
            onPress={() => setActiveFilter('security')}
          >
            <Text style={[styles.filterText, activeFilter === 'security' && styles.activeFilterText]}>
              Security
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.notificationsList}>
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome name="bell-o" size={48} color="#ccc" />
            <Text style={styles.emptyStateTitle}>No notifications</Text>
            <Text style={styles.emptyStateText}>
              You don't have any {activeFilter !== 'all' ? `${activeFilter} ` : ''}notifications yet
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              {...notification}
              onPress={() => {
                // Handle notification press
                if (notification.type === 'payment') {
                  router.push('/history');
                } else if (notification.type === 'security') {
                  router.push('/security');
                }
              }}
            />
          ))
        )}
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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  filterContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
    height: '100%',
    gap: 10,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    height: 40,
    justifyContent: 'center',
  },
  activeFilterTab: {
    backgroundColor: '#fff',
  },
  filterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#8134AF',
  },
  notificationsList: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
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
  unreadNotification: {
    backgroundColor: '#F8F4FF',
    borderLeftWidth: 4,
    borderLeftColor: '#8134AF',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8134AF',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});