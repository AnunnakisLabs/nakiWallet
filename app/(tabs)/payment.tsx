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

const TransactionConfirmation = ({ isVisible, type, amount, recipient, onConfirm, onCancel, isLoading }) => {
  if (!isVisible) return null;

  const handleShare = async () => {
    try {
      const message = type === 'pay'
        ? `I just sent $${amount} to ${recipient.name} using Naki!`
        : `I requested $${amount} from ${recipient.name} using Naki!`;
      
      if (Platform.OS === 'web') {
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'Naki Payment',
              text: message,
              url: 'https://naki.app',
            });
          } catch (error) {
            if (error.name !== 'AbortError') {
              console.error('Share failed:', error);
              await navigator.clipboard.writeText(message);
              Alert.alert('Copied!', 'Payment message copied to clipboard');
            }
          }
        } else {
          await navigator.clipboard.writeText(message);
          Alert.alert('Copied!', 'Payment message copied to clipboard');
        }
      } else {
        await Share.share({
          message,
          url: 'https://naki.app',
        });
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Could not share the payment message');
    }
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modal}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {type === 'pay' ? 'Confirm Payment' : 'Confirm Request'}
          </Text>
        </View>
        
        <View style={styles.modalContent}>
          <Text style={styles.modalAmount}>${parseFloat(amount).toFixed(2)}</Text>
          <Text style={styles.modalText}>
            {type === 'pay' ? 'Pay to' : 'Request from'}
          </Text>
          <View style={styles.modalRecipient}>
            <Image source={{ uri: recipient.image }} style={styles.modalRecipientImage} />
            <Text style={styles.modalRecipientName}>{recipient.name}</Text>
            <Text style={styles.modalRecipientUsername}>{recipient.username}</Text>
          </View>
        </View>

        <View style={styles.modalSocial}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <FontAwesome name="share-alt" size={20} color="#8134AF" />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.modalActions}>
          <TouchableOpacity 
            style={styles.modalCancelButton} 
            onPress={onCancel}
            disabled={isLoading}
          >
            <Text style={styles.modalCancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.modalConfirmButton,
              type === 'request' && styles.modalRequestButton,
              isLoading && styles.modalButtonDisabled
            ]} 
            onPress={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.modalConfirmButtonText}>
                {type === 'pay' ? 'Pay' : 'Request'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactionType, setTransactionType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const recentContacts = [
    { id: 1, name: 'Anouk', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120' },
    { id: 2, name: 'Ruben', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120' },
    { id: 3, name: 'Veronica', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
    { id: 4, name: 'Pablo', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120' },
  ];

  const contacts = [
    { id: 1, name: 'Anouk Graaf', username: '@anoukgraaf', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120' },
    { id: 2, name: 'Ruben Martinez', username: '@rubenmartinez', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120' },
    { id: 3, name: 'Veronica Chen', username: '@veronicachen', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
    { id: 4, name: 'Pablo Silva', username: '@pablosilva', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120' },
    { id: 5, name: 'Emma Wilson', username: '@emmawilson', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120' },
    { id: 6, name: 'David Kim', username: '@davidkim', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120' },
  ];

  React.useEffect(() => {
    if (!selectedContact && params.name && params.username && params.avatar) {
      setSelectedContact({
        name: params.name as string,
        username: params.username as string,
        image: params.avatar as string,
      });
    }
    if (!transactionType && params.type) {
      setTransactionType(params.type as string);
    }
  }, [params]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickAmounts = ['$5', '$10', '$20', '$50', '$100'];

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setError(null);
  };

  const validateTransaction = () => {
    if (!selectedContact) {
      setError('Please select a contact');
      return false;
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    return true;
  };

  const handleTransactionInitiate = (type) => {
    if (!validateTransaction()) return;
    
    setTransactionType(type);
    setShowConfirmation(true);
  };

  const handleTransactionConfirm = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate success
      const successMessage = transactionType === 'pay'
        ? `Successfully sent $${amount} to ${selectedContact.name}`
        : `Successfully requested $${amount} from ${selectedContact.name}`;

      setShowConfirmation(false);
      setIsLoading(false);
      
      // Reset form
      setAmount('');
      setNote('');
      setSelectedContact(null);

      // Show success message
      if (Platform.OS === 'web') {
        alert(successMessage);
      } else {
        Alert.alert('Success', successMessage);
      }

      // Navigate back
      router.back();
    } catch (error) {
      setIsLoading(false);
      setError('Transaction failed. Please try again.');
      setShowConfirmation(false);
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
          <TouchableOpacity style={styles.scanButton} onPress={() => router.push('/qr')}>
            <FontAwesome name="qrcode" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Search Bar */}
        {!selectedContact && (
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
        )}

        {/* Selected Contact */}
        {selectedContact && (
          <View style={styles.selectedContactContainer}>
            <Image source={{ uri: selectedContact.image }} style={styles.selectedContactImage} />
            <View style={styles.selectedContactInfo}>
              <Text style={styles.selectedContactName}>{selectedContact.name}</Text>
              <Text style={styles.selectedContactUsername}>{selectedContact.username}</Text>
            </View>
            <TouchableOpacity 
              style={styles.changeButton}
              onPress={() => setSelectedContact(null)}
            >
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
        )}

        {!selectedContact && (
          <>
            {/* Recent Contacts */}
            <View style={styles.recentContactsContainer}>
              <Text style={styles.sectionTitle}>Recent</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentContactsScroll}>
                {recentContacts.map((contact) => (
                  <RecentContact
                    key={contact.id}
                    {...contact}
                    onSelect={() => handleContactSelect(contacts.find(c => c.id === contact.id))}
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
                style={styles.requestButton}
                onPress={() => handleTransactionInitiate('request')}
              >
                <Text style={styles.buttonText}>Request</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.payButton}
                onPress={() => handleTransactionInitiate('pay')}
              >
                <Text style={styles.buttonText}>Pay</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {/* Transaction Confirmation Modal */}
      <TransactionConfirmation
        isVisible={showConfirmation}
        type={transactionType}
        amount={amount}
        recipient={selectedContact}
        onConfirm={handleTransactionConfirm}
        onCancel={() => setShowConfirmation(false)}
        isLoading={isLoading}
      />
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
  scanButton: {
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
    backgroundColor: '#fff',
    margin: 20,
    padding: 15,
    borderRadius: 12,
  },
  selectedContactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  selectedContactInfo: {
    flex: 1,
    marginLeft: 15,
  },
  selectedContactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  selectedContactUsername: {
    fontSize: 14,
    color: '#666',
  },
  changeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F8F4FF',
    borderRadius: 8,
  },
  changeButtonText: {
    color: '#8134AF',
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  modalContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  modalRecipient: {
    alignItems: 'center',
  },
  modalRecipientImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  modalRecipientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  modalRecipientUsername: {
    fontSize: 14,
    color: '#666',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#9C27B0',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalRequestButton: {
    backgroundColor: '#5B2C8D',
  },
  modalButtonDisabled: {
    opacity: 0.7,
  },
  modalConfirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSocial: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F4FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  shareButtonText: {
    color: '#8134AF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});