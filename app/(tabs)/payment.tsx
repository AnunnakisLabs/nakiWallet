import React, { useState, useEffect } from 'react';
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
  BackHandler,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter, useLocalSearchParams, useNavigation } from 'expo-router';

const Contact = ({ image, name, username, onSelect }) => (
  <TouchableOpacity style={styles.contact} onPress={onSelect}>
    <Image source={{ uri: image }} style={styles.contactImage} />
    <View style={styles.contactInfo}>
      <Text style={styles.contactName}>{name}</Text>
      <Text style={styles.contactUsername}>{username}</Text>
    </View>
    <FontAwesome name="chevron-right" size={16} color="#666" />
  </TouchableOpacity>
);

const RecentContact = ({ image, name, onSelect }) => (
  <TouchableOpacity style={styles.recentContact} onPress={onSelect}>
    <Image source={{ uri: image }} style={styles.recentContactImage} />
    <Text style={styles.recentContactName}>{name}</Text>
  </TouchableOpacity>
);

export default function PaymentScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const [amount, setAmount] = useState(params.amount ? String(params.amount) : '');
  const [note, setNote] = useState(params.note ? String(params.note) : '');
  const [searchQuery, setSearchQuery] = useState('');
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

  const contacts = [
    { id: 1, name: 'Anouk Rímola', username: '@AnoukRImola', image: 'https://avatars.githubusercontent.com/u/77553677?v=4' },
    { id: 2, name: 'Ruben Abarca', username: '@espaciofuturoio', image: 'https://avatars.githubusercontent.com/u/164825567?v=4' },
    { id: 3, name: 'Veronica Jiménez', username: '@veronicajimenez', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
    { id: 4, name: 'Pablo Villaplana', username: '@PabloVillaplana', image: 'https://avatars.githubusercontent.com/u/35789725?v=4' },
    { id: 5, name: 'Elsie Diaz', username: '@elsiediaz', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120' },
    { id: 6, name: 'Wally Rodriguez', username: '@wally777', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120' },
  ];

  const recentTransactions = [
    { 
      id: 1, 
      type: 'outgoing',
      amount: 45.00,
      name: 'Ruben Abarca', 
      username: '@espaciofuturoio',
      address: '0x8765...4321',
      image: 'https://avatars.githubusercontent.com/u/164825567?v=4',
      message: '🍽️ Dinner payment',
      time: '2h ago'
    },
    { 
      id: 2, 
      type: 'incoming',
      amount: 28.50,
      name: 'Anouk Rímola',
      username: '@AnoukRImola',
      address: '0x9876...5432', 
      image: 'https://avatars.githubusercontent.com/u/77553677?v=4',
      message: '🎵 Concert tickets',
      time: '5h ago'
    },
    { 
      id: 3, 
      type: 'outgoing',
      amount: 12.75,
      name: 'Pablo Villaplana',
      username: '@PabloVillaplana',
      address: '0x3456...7890', 
      image: 'https://avatars.githubusercontent.com/u/35789725?v=4',
      message: '☕ Coffee and pastries',
      time: 'Yesterday'
    },
  ];

  const quickAmounts = ['$5', '$10', '$20', '$50', '$100'];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSelect = (contact) => {
    setSelectedContact({
      name: contact.name,
      username: contact.username,
      image: contact.image,
      address: contact.address || '0x1234...5678' // Example address if not provided
    });
    setError(null);
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
      handleBackPress();
    } catch (error) {
      setError(type === 'pay' ? 'Payment failed. Please try again.' : 'Request failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    try {
      if (navigation && navigation.canGoBack()) {
        navigation.goBack();
      } else {
        router.replace('/'); // O cualquier otra ruta principal de tu app
      }
    } catch (error) {
      console.log('Error al navegar hacia atrás:', error);
      router.replace('/');
    }
  };

  useEffect(() => {
    const backAction = () => {
      handleBackPress();
      return true; // Previene el comportamiento por defecto
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => handleBackPress()} style={styles.backButton}>
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
          <>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <FontAwesome name="search" size={16} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search contacts..."
                placeholderTextColor="#666"
              />
            </View>

            {/* Recent Contacts */}
            <View style={styles.recentContactsContainer}>
              <Text style={styles.sectionTitle}>Recent</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentContactsScroll}>
                {recentTransactions.map((transaction) => (
                  <RecentContact
                    key={transaction.id}
                    image={transaction.image}
                    name={transaction.name}
                    onSelect={() => handleContactSelect({
                      name: transaction.name,
                      username: transaction.username,
                      image: transaction.image,
                      address: transaction.address,
                    })}
                  />
                ))}
              </ScrollView>
            </View>

            {/* Contacts List */}
            <View style={styles.contactsContainer}>
              <Text style={styles.sectionTitle}>All Contacts</Text>
              {filteredContacts.map((contact) => (
                <Contact
                  key={contact.id}
                  {...contact}
                  onSelect={() => handleContactSelect(contact)}
                />
              ))}
            </View>
          </>
        )}

        {selectedContact && (
          <>
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
          </>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 4,
  },
  searchIcon: {
    padding: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: '#000',
    fontSize: 16,
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
  contactsContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginTop: 20,
  },
  contact: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  contactUsername: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
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