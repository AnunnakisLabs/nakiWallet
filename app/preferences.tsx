import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PreferenceOption = ({ icon, title, subtitle, value, onPress }) => (
  <TouchableOpacity style={styles.preferenceOption} onPress={onPress}>
    <View style={styles.optionIcon}>
      <FontAwesome name={icon} size={20} color="#8134AF" />
    </View>
    <View style={styles.optionContent}>
      <Text style={styles.optionTitle}>{title}</Text>
      <Text style={styles.optionSubtitle}>{subtitle}</Text>
    </View>
    <View style={styles.optionValue}>
      <Text style={styles.valueText}>{value}</Text>
      <FontAwesome name="chevron-right" size={16} color="#666" />
    </View>
  </TouchableOpacity>
);

export default function PreferencesScreen() {
  const router = useRouter();
  const [preferences, setPreferences] = useState({
    language: 'English',
    currency: 'USD',
    theme: 'Light',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12-hour',
  });

  const handlePreferenceChange = (preference: string, options: string[]) => {
    const currentIndex = options.indexOf(preferences[preference]);
    const nextIndex = (currentIndex + 1) % options.length;
    setPreferences(prev => ({ ...prev, [preference]: options[nextIndex] }));
  };

  const showOptions = (title: string, options: string[], currentValue: string, onSelect: (value: string) => void) => {
    if (Platform.OS === 'web') {
      const selected = prompt(`Select ${title} (${options.join(', ')}):`, currentValue);
      if (selected && options.includes(selected)) {
        onSelect(selected);
      }
    } else {
      Alert.alert(
        `Select ${title}`,
        '',
        options.map(option => ({
          text: option,
          onPress: () => onSelect(option),
          style: option === currentValue ? 'cancel' : 'default',
        }))
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preferences</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Display Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display Settings</Text>
          <PreferenceOption
            icon="language"
            title="Language"
            subtitle="Choose your preferred language"
            value={preferences.language}
            onPress={() => {
              const options = ['English', 'Spanish', 'French', 'German'];
              showOptions('Language', options, preferences.language, (value) => {
                setPreferences(prev => ({ ...prev, language: value }));
              });
            }}
          />
          <PreferenceOption
            icon="moon-o"
            title="Theme"
            subtitle="Choose app appearance"
            value={preferences.theme}
            onPress={() => {
              const options = ['Light', 'Dark', 'System'];
              showOptions('Theme', options, preferences.theme, (value) => {
                setPreferences(prev => ({ ...prev, theme: value }));
              });
            }}
          />
        </View>

        {/* Regional Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Regional Settings</Text>
          <PreferenceOption
            icon="money"
            title="Currency"
            subtitle="Set your preferred currency"
            value={preferences.currency}
            onPress={() => {
              const options = ['USD', 'EUR', 'GBP', 'JPY'];
              showOptions('Currency', options, preferences.currency, (value) => {
                setPreferences(prev => ({ ...prev, currency: value }));
              });
            }}
          />
          <PreferenceOption
            icon="calendar"
            title="Date Format"
            subtitle="Choose how dates are displayed"
            value={preferences.dateFormat}
            onPress={() => {
              const options = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'];
              showOptions('Date Format', options, preferences.dateFormat, (value) => {
                setPreferences(prev => ({ ...prev, dateFormat: value }));
              });
            }}
          />
          <PreferenceOption
            icon="clock-o"
            title="Time Format"
            subtitle="Choose time display format"
            value={preferences.timeFormat}
            onPress={() => {
              const options = ['12-hour', '24-hour'];
              showOptions('Time Format', options, preferences.timeFormat, (value) => {
                setPreferences(prev => ({ ...prev, timeFormat: value }));
              });
            }}
          />
        </View>

        {/* Payment Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Preferences</Text>
          <PreferenceOption
            icon="credit-card"
            title="Default Payment Method"
            subtitle="Choose your preferred payment method"
            value="Debit Card"
            onPress={() => {
              const options = ['Debit Card', 'Bank Transfer', 'PayPal'];
              showOptions('Default Payment Method', options, 'Debit Card', (value) => {
                // Handle payment method change
              });
            }}
          />
          <PreferenceOption
            icon="bank"
            title="Default Bank Account"
            subtitle="Set primary bank account"
            value="Chase Bank (...4567)"
            onPress={() => {
              const options = ['Chase Bank (...4567)', 'Bank of America (...8901)'];
              showOptions('Default Bank Account', options, 'Chase Bank (...4567)', (value) => {
                // Handle bank account change
              });
            }}
          />
        </View>

        {/* Privacy Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Preferences</Text>
          <PreferenceOption
            icon="user"
            title="Profile Visibility"
            subtitle="Control who can see your profile"
            value="Friends Only"
            onPress={() => {
              const options = ['Public', 'Friends Only', 'Private'];
              showOptions('Profile Visibility', options, 'Friends Only', (value) => {
                // Handle visibility change
              });
            }}
          />
          <PreferenceOption
            icon="history"
            title="Transaction History"
            subtitle="Control transaction visibility"
            value="Private"
            onPress={() => {
              const options = ['Public', 'Friends Only', 'Private'];
              showOptions('Transaction History', options, 'Private', (value) => {
                // Handle visibility change
              });
            }}
          />
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
  preferenceOption: {
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
  optionValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 14,
    color: '#8134AF',
    marginRight: 8,
  },
});