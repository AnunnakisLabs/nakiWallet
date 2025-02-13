import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const menuItems = [
  {
    id: 'personal',
    title: 'Personal Information',
    icon: 'person-outline',
  },
  {
    id: 'payment',
    title: 'Payment Methods',
    icon: 'card-outline',
  },
  {
    id: 'security',
    title: 'Security',
    icon: 'shield-outline',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: 'notifications-outline',
  },
  {
    id: 'help',
    title: 'Help & Support',
    icon: 'help-circle-outline',
  },
  {
    id: 'about',
    title: 'About',
    icon: 'information-circle-outline',
  },
];

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
            }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.username}>@johndoe</Text>
          </View>
          <Pressable style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>127</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>45</Text>
            <Text style={styles.statLabel}>Contacts</Text>
          </View>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <Pressable key={item.id} style={styles.menuItem}>
            <View style={styles.menuItemContent}>
              <View style={styles.menuItemIcon}>
                <Ionicons name={item.icon} size={24} color="#2a5298" />
              </View>
              <Text style={styles.menuItemTitle}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={24} color="#e74c3c" />
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 60,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
  },
  username: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  editButton: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#2a5298',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#eee',
  },
  menuContainer: {
    backgroundColor: 'white',
    marginTop: 20,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemTitle: {
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: 20,
    padding: 16,
  },
  logoutText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});