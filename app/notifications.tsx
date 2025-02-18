import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const NotificationItem = ({ type, title, message, time, read }) => {
  const getIcon = () => {
    switch (type) {
      case 'payment':
        return 'dollar';
      case 'transfer':
        return 'exchange';
      case 'security':
        return 'shield';
      default:
        return 'bell';
    }
  };

  return (
    <TouchableOpacity style={[styles.notification, !read && styles.unreadNotification]}>
      <View style={[styles.notificationIcon, { backgroundColor: getIconBackground(type) }]}>
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

const getIconBackground = (type) => {
  switch (type) {
    case 'payment':
      return '#4BB543';
    case 'transfer':
      return '#FF9800';
    case 'security':
      return '#FF4B4B';
    default:
      return '#8134AF';
  }
};

export default function NotificationsScreen() {
  const router = useRouter();
  const notifications = [
    {
      id: 1,
      type: 'payment',
      title: 'Payment Received',
      message: 'You received $28.50 from Anouk Graaf',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      type: 'transfer',
      title: 'Transfer Completed',
      message: 'Your transfer of $45.00 to Ruben Martinez was successful',
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
      message: 'Pablo Silva requested $95.00',
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
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <FontAwesome name="ellipsis-v" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={[styles.filterTab, styles.activeFilterTab]}>
          <Text style={[styles.filterText, styles.activeFilterText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterText}>Unread</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterTab}>
          <Text style={styles.filterText}>Important</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.notificationsList}>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} {...notification} />
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  settingsButton: {
    padding: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterTab: {
    backgroundColor: '#fff',
  },
  filterText: {
    color: '#E0E0E0',
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
});