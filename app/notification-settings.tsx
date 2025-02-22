import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const NotificationOption = ({ icon, title, subtitle, value, onValueChange }) => (
  <View style={styles.notificationOption}>
    <View style={styles.optionIcon}>
      <FontAwesome name={icon} size={20} color="#8134AF" />
    </View>
    <View style={styles.optionContent}>
      <Text style={styles.optionTitle}>{title}</Text>
      <Text style={styles.optionSubtitle}>{subtitle}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#E0E0E0', true: '#B39DDB' }}
      thumbColor={value ? '#8134AF' : '#f4f3f4'}
    />
  </View>
);

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    payments: true,
    security: true,
    marketing: false,
    balance: true,
    rewards: true,
    news: false,
    sound: true,
    vibration: true,
  });

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Transaction Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction Notifications</Text>
          <NotificationOption
            icon="money"
            title="Payments"
            subtitle="Get notified about payments and transfers"
            value={settings.payments}
            onValueChange={(value) => handleSettingChange('payments', value)}
          />
          <NotificationOption
            icon="line-chart"
            title="Balance Updates"
            subtitle="Get notified about balance changes"
            value={settings.balance}
            onValueChange={(value) => handleSettingChange('balance', value)}
          />
        </View>

        {/* Security Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Notifications</Text>
          <NotificationOption
            icon="shield"
            title="Security Alerts"
            subtitle="Get notified about security events"
            value={settings.security}
            onValueChange={(value) => handleSettingChange('security', value)}
          />
          <NotificationOption
            icon="mobile"
            title="New Device Login"
            subtitle="Get notified when a new device logs in"
            value={settings.security}
            onValueChange={(value) => handleSettingChange('security', value)}
          />
        </View>

        {/* Other Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Notifications</Text>
          <NotificationOption
            icon="gift"
            title="Rewards & Offers"
            subtitle="Get notified about rewards and special offers"
            value={settings.rewards}
            onValueChange={(value) => handleSettingChange('rewards', value)}
          />
          <NotificationOption
            icon="newspaper-o"
            title="News & Updates"
            subtitle="Get notified about app updates and news"
            value={settings.news}
            onValueChange={(value) => handleSettingChange('news', value)}
          />
          <NotificationOption
            icon="bullhorn"
            title="Marketing"
            subtitle="Receive marketing communications"
            value={settings.marketing}
            onValueChange={(value) => handleSettingChange('marketing', value)}
          />
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          <NotificationOption
            icon="bell"
            title="Sound"
            subtitle="Play sound for notifications"
            value={settings.sound}
            onValueChange={(value) => handleSettingChange('sound', value)}
          />
          <NotificationOption
            icon="mobile"
            title="Vibration"
            subtitle="Vibrate for notifications"
            value={settings.vibration}
            onValueChange={(value) => handleSettingChange('vibration', value)}
          />
        </View>

        {/* Quiet Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quiet Hours</Text>
          <TouchableOpacity style={styles.quietHoursButton}>
            <View style={styles.quietHoursInfo}>
              <Text style={styles.quietHoursTitle}>Set Quiet Hours</Text>
              <Text style={styles.quietHoursSubtitle}>
                Mute notifications during specific hours
              </Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#666" />
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  section: {
    backgroundColor: '#fff',
    margin: 20,
    marginBottom: 0,
    padding: 20,
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  notificationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  quietHoursButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  quietHoursInfo: {
    flex: 1,
  },
  quietHoursTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  quietHoursSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});