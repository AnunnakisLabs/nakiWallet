import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SecurityOption = ({ icon, title, subtitle, value, onValueChange, type = 'switch' }) => (
  <View style={styles.securityOption}>
    <View style={styles.optionIcon}>
      <FontAwesome name={icon} size={20} color="#8134AF" />
    </View>
    <View style={styles.optionContent}>
      <Text style={styles.optionTitle}>{title}</Text>
      <Text style={styles.optionSubtitle}>{subtitle}</Text>
    </View>
    {type === 'switch' ? (
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E0E0E0', true: '#B39DDB' }}
        thumbColor={value ? '#8134AF' : '#f4f3f4'}
      />
    ) : (
      <TouchableOpacity onPress={onValueChange}>
        <FontAwesome name="chevron-right" size={16} color="#666" />
      </TouchableOpacity>
    )}
  </View>
);

export default function SecurityScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    faceId: true,
    twoFactor: true,
    biometric: true,
    transactionPin: true,
    deviceManagement: false,
  });

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [setting]: value }));

    // Show confirmation for important security changes
    if (!value && (setting === 'twoFactor' || setting === 'transactionPin')) {
      if (Platform.OS === 'web') {
        if (!confirm('Are you sure you want to disable this security feature?')) {
          setSettings(prev => ({ ...prev, [setting]: true }));
        }
      } else {
        Alert.alert(
          'Confirm Security Change',
          'Are you sure you want to disable this security feature?',
          [
            {
              text: 'Cancel',
              onPress: () => setSettings(prev => ({ ...prev, [setting]: true })),
              style: 'cancel',
            },
            { text: 'Disable', style: 'destructive' },
          ]
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Biometric Authentication */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Biometric Authentication</Text>
          <SecurityOption
            icon="fingerprint"
            title="Face ID / Touch ID"
            subtitle="Use biometric authentication to log in"
            value={settings.faceId}
            onValueChange={(value) => handleSettingChange('faceId', value)}
          />
          <SecurityOption
            icon="mobile"
            title="Biometric Payments"
            subtitle="Use biometrics to confirm payments"
            value={settings.biometric}
            onValueChange={(value) => handleSettingChange('biometric', value)}
          />
        </View>

        {/* Account Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Security</Text>
          <SecurityOption
            icon="lock"
            title="Two-Factor Authentication"
            subtitle="Add an extra layer of security"
            value={settings.twoFactor}
            onValueChange={(value) => handleSettingChange('twoFactor', value)}
          />
          <SecurityOption
            icon="key"
            title="Transaction PIN"
            subtitle="Require PIN for all transactions"
            value={settings.transactionPin}
            onValueChange={(value) => handleSettingChange('transactionPin', value)}
          />
          <SecurityOption
            icon="shield"
            title="Change Password"
            subtitle="Update your account password"
            type="button"
            onValueChange={() => {
              // Handle password change
              Alert.alert('Change Password', 'Password change functionality will be implemented here.');
            }}
          />
        </View>

        {/* Device Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Management</Text>
          <SecurityOption
            icon="mobile"
            title="Trusted Devices"
            subtitle="Manage devices that can access your account"
            type="button"
            onValueChange={() => {
              // Navigate to device management screen
              Alert.alert('Trusted Devices', 'Device management functionality will be implemented here.');
            }}
          />
          <SecurityOption
            icon="bell"
            title="Login Notifications"
            subtitle="Get notified of new device logins"
            value={settings.deviceManagement}
            onValueChange={(value) => handleSettingChange('deviceManagement', value)}
          />
        </View>

        {/* Activity Log */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Log</Text>
          <SecurityOption
            icon="history"
            title="Security Activity"
            subtitle="View recent security events"
            type="button"
            onValueChange={() => {
              // Navigate to activity log
              Alert.alert('Security Activity', 'Activity log functionality will be implemented here.');
            }}
          />
        </View>

        {/* Emergency */}
        <TouchableOpacity 
          style={styles.emergencyButton}
          onPress={() => {
            if (Platform.OS === 'web') {
              if (confirm('Are you sure you want to lock your account? This will prevent all access until you contact support.')) {
                Alert.alert('Account Locked', 'Your account has been locked. Please contact support to unlock it.');
              }
            } else {
              Alert.alert(
                'Lock Account',
                'Are you sure you want to lock your account? This will prevent all access until you contact support.',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Lock Account',
                    style: 'destructive',
                    onPress: () => {
                      Alert.alert('Account Locked', 'Your account has been locked. Please contact support to unlock it.');
                    },
                  },
                ]
              );
            }
          }}
        >
          <FontAwesome name="exclamation-triangle" size={20} color="#FF4B4B" />
          <Text style={styles.emergencyButtonText}>Lock Account</Text>
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
  securityOption: {
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
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  emergencyButtonText: {
    color: '#FF4B4B',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});