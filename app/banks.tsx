import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const BankAccount = ({ account, isDefault, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <LinearGradient
      colors={account.colors}
      style={styles.accountCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {isDefault && (
        <View style={styles.defaultBadge}>
          <Text style={styles.defaultBadgeText}>Primary</Text>
        </View>
      )}
      <View style={styles.accountHeader}>
        <Text style={styles.bankName}>{account.bankName}</Text>
        <FontAwesome name="bank" size={24} color="#fff" />
      </View>
      <Text style={styles.accountNumber}>
        •••• {account.lastFour}
      </Text>
      <View style={styles.accountFooter}>
        <View>
          <Text style={styles.accountLabel}>Account Type</Text>
          <Text style={styles.accountValue}>{account.type}</Text>
        </View>
        <View>
          <Text style={styles.accountLabel}>Balance</Text>
          <Text style={styles.accountValue}>${account.balance.toFixed(2)}</Text>
        </View>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

export default function BanksScreen() {
  const router = useRouter();
  const [showAddBank, setShowAddBank] = useState(false);
  const [newBank, setNewBank] = useState({
    accountNumber: '',
    routingNumber: '',
    accountType: '',
  });

  const accounts = [
    {
      id: '1',
      bankName: 'Chase Bank',
      type: 'Checking',
      lastFour: '4567',
      balance: 5234.56,
      colors: ['#1E88E5', '#1565C0'],
    },
    {
      id: '2',
      bankName: 'Bank of America',
      type: 'Savings',
      lastFour: '8901',
      balance: 12458.90,
      colors: ['#43A047', '#2E7D32'],
    },
  ];

  const handleAddBank = () => {
    // Implement bank account addition logic here
    setShowAddBank(false);
    setNewBank({
      accountNumber: '',
      routingNumber: '',
      accountType: '',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Banks</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddBank(true)}
        >
          <FontAwesome name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Bank Accounts List */}
        <View style={styles.accountsContainer}>
          {accounts.map((account, index) => (
            <BankAccount
              key={account.id}
              account={account}
              isDefault={index === 0}
              onPress={() => {}}
            />
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <FontAwesome name="exchange" size={20} color="#8134AF" />
            </View>
            <Text style={styles.actionText}>Transfer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <FontAwesome name="file-text" size={20} color="#8134AF" />
            </View>
            <Text style={styles.actionText}>Statements</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <FontAwesome name="line-chart" size={20} color="#8134AF" />
            </View>
            <Text style={styles.actionText}>Analytics</Text>
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <View style={styles.settingsContainer}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <FontAwesome name="shield" size={20} color="#8134AF" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Account Security</Text>
              <Text style={styles.settingDescription}>
                Manage account access and permissions
              </Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <FontAwesome name="bell" size={20} color="#8134AF" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Set up alerts for transactions and balance
              </Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <FontAwesome name="cog" size={20} color="#8134AF" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Account Settings</Text>
              <Text style={styles.settingDescription}>
                Manage account preferences and limits
              </Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Bank Modal */}
      {showAddBank && (
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Link Bank Account</Text>
              <TouchableOpacity 
                onPress={() => setShowAddBank(false)}
                style={styles.closeButton}
              >
                <FontAwesome name="times" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Account Number</Text>
              <TextInput
                style={styles.input}
                value={newBank.accountNumber}
                onChangeText={(text) => setNewBank({ ...newBank, accountNumber: text })}
                placeholder="Enter account number"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Routing Number</Text>
              <TextInput
                style={styles.input}
                value={newBank.routingNumber}
                onChangeText={(text) => setNewBank({ ...newBank, routingNumber: text })}
                placeholder="Enter routing number"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Account Type</Text>
              <TextInput
                style={styles.input}
                value={newBank.accountType}
                onChangeText={(text) => setNewBank({ ...newBank, accountType: text })}
                placeholder="Checking or Savings"
              />
            </View>

            <TouchableOpacity 
              style={styles.addBankButton}
              onPress={handleAddBank}
            >
              <Text style={styles.addBankButtonText}>Link Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  accountsContainer: {
    padding: 20,
  },
  accountCard: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      },
    }),
  },
  defaultBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  defaultBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  bankName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  accountNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 30,
  },
  accountFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  accountLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginBottom: 4,
  },
  accountValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
  },
  settingsContainer: {
    backgroundColor: '#fff',
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    padding: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addBankButton: {
    backgroundColor: '#8134AF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBankButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});