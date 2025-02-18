import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';

const RecentContact = ({ image, name, onPress }) => (
  <TouchableOpacity style={styles.recentContact} onPress={onPress}>
    <Image source={{ uri: image }} style={styles.recentContactImage} />
    <Text style={styles.recentContactName}>{name}</Text>
  </TouchableOpacity>
);

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(
    params.name ? {
      name: params.name as string,
      username: params.username as string,
      image: params.avatar as string,
      address: params.address as string,
    } : null
  );

  const recentContacts = [
    { id: 1, name: 'Anouk', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120' },
    { id: 2, name: 'Ruben', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120' },
    { id: 3, name: 'Veronica', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
    { id: 4, name: 'Pablo', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120' },
  ];

  const quickAmounts = ['$5', '$10', '$20', '$50', '$100'];

  const handleRecentContactPress = (contact) => {
    setSelectedContact({
      name: contact.name,
      username: `@${contact.name.toLowerCase()}`,
      image: contact.image,
      address: '0x1234...5678' // Example address
    });
  };

  const handlePayment = async (type: 'pay' | 'request') => {
    if (!selectedContact) {
      setError('Please select a contact');
      return;
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Show success message
      const message = type === 'pay' 
        ? `Payment of $${amount} sent to ${selectedContact.name} successfully!`
        : `Payment request of $${amount} sent to ${selectedContact.name} successfully!`;

      if (Platform.OS === 'web') {
        alert(message);
      } else {
        Alert.alert('Success', message);
      }

      // Reset form
      setAmount('');
      setNote('');
      setSelectedContact(null);
      
      // Navigate back
      router.back();
    } catch (error) {
      setError(type === 'pay' ? 'Payment failed. Please try again.' : 'Request failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Send Money</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.push('/nfc-payment')}
            >
              <FontAwesome name="wifi" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.push('/qr')}
            >
              <FontAwesome name="qrcode" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Selected Contact */}
        {selectedContact ? (
          <View style={styles.selectedContactContainer}>
            <Image 
              source={{ uri: selectedContact.image }} 
              style={styles.selectedContactImage} 
            />
            <View style={styles.selectedContactInfo}>
              <Text style={styles.selectedContactName}>{selectedContact.name}</Text>
              <Text style={styles.selectedContactUsername}>{selectedContact.username}</Text>
              <Text style={styles.selectedContactAddress}>{selectedContact.address}</Text>
            </View>
            <TouchableOpacity 
              style={styles.changeButton}
              onPress={() => setSelectedContact(null)}
            >
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Recent Contacts */
          <View style={styles.recentContactsContainer}>
            <Text style={styles.sectionTitle}>Recent</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentContactsScroll}>
              {recentContacts.map((contact) => (
                <RecentContact 
                  key={contact.id} 
                  image={contact.image} 
                  name={contact.name}
                  onPress={() => handleRecentContactPress(contact)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Amount Input */}
        <View style={styles.amountContainer}>
          <Text style={styles.dollarSign}>$</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            placeholderTextColor="#B39DDB"
            keyboardType="decimal-pad"
            maxLength={7}
          />
        </View>

        {/* Quick Amounts */}
        <View style={styles.quickAmountsContainer}>
          {quickAmounts.map((quickAmount) => (
            <TouchableOpacity
              key={quickAmount}
              style={styles.quickAmountButton}
              onPress={() => setAmount(quickAmount.replace('$', ''))}
            >
              <Text style={styles.quickAmountText}>{quickAmount}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Note Input */}
        <View style={styles.noteContainer}>
          <FontAwesome name="pencil" size={20} color="#666" style={styles.noteIcon} />
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="What's it for?"
            placeholderTextColor="#666"
          />
        </View>

        {/* Payment Buttons */}
        <View style={styles.paymentButtonsContainer}>
          <TouchableOpacity 
            style={[styles.requestButton, isLoading && styles.buttonDisabled]}
            onPress={() => handlePayment('request')}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Request</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.payButton, isLoading && styles.buttonDisabled]}
            onPress={() => handlePayment('pay')}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Pay</Text>
            )}
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 75, 75, 0.1)',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
  },
  errorText: {
    color: '#FF4B4B',
    fontSize: 14,
    textAlign: 'center',
  },
  selectedContactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  selectedContactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  selectedContactInfo: {
    flex: 1,
  },
  selectedContactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  selectedContactUsername: {
    fontSize: 14,
    color: '#E0E0E0',
    marginBottom: 2,
  },
  selectedContactAddress: {
    fontSize: 12,
    color: '#E0E0E0',
    fontFamily: Platform.select({
      ios: 'Courier',
      android: 'monospace',
      default: 'monospace',
    }),
  },
  changeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  recentContactsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  recentContactsScroll: {
    flexDirection: 'row',
  },
  recentContact: {
    alignItems: 'center',
    marginRight: 20,
  },
  recentContactImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  recentContactName: {
    color: '#fff',
    fontSize: 14,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  dollarSign: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 4,
  },
  amountInput: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    minWidth: 100,
    textAlign: 'center',
  },
  quickAmountsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    gap: 10,
  },
  quickAmountButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickAmountText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 4,
  },
  noteIcon: {
    padding: 10,
  },
  noteInput: {
    flex: 1,
    height: 50,
    color: '#000',
    fontSize: 16,
  },
  paymentButtonsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  requestButton: {
    flex: 1,
    backgroundColor: '#5B2C8D',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payButton: {
    flex: 1,
    backgroundColor: '#9C27B0',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});