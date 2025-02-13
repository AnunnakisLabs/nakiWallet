import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const contacts = [
  {
    id: '1',
    name: 'Sarah Wilson',
    username: '@sarah',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  },
  {
    id: '2',
    name: 'Michael Chen',
    username: '@mchen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
  },
  // Add more contacts
];

export default function PayScreen() {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Send Payment</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.amountContainer}>
          <Text style={styles.label}>Amount (USDC)</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.contactsSection}>
          <Text style={styles.sectionTitle}>Recent Contacts</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.contactsList}>
            {contacts.map((contact) => (
              <Pressable
                key={contact.id}
                style={[
                  styles.contactItem,
                  selectedContact?.id === contact.id && styles.selectedContact,
                ]}
                onPress={() => setSelectedContact(contact)}>
                <Image
                  source={{ uri: contact.avatar }}
                  style={styles.contactAvatar}
                />
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.username}>{contact.username}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.noteContainer}>
          <Text style={styles.label}>Note</Text>
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="What's it for?"
            placeholderTextColor="#999"
            multiline
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.sendButton, !amount && styles.sendButtonDisabled]}>
          <Text style={styles.sendButtonText}>Send Payment</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  amountContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '500',
    marginRight: 5,
  },
  amountInput: {
    fontSize: 24,
    flex: 1,
  },
  contactsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  contactsList: {
    flexDirection: 'row',
  },
  contactItem: {
    alignItems: 'center',
    marginRight: 20,
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  selectedContact: {
    backgroundColor: '#e3f2fd',
  },
  contactAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '500',
  },
  username: {
    fontSize: 12,
    color: '#666',
  },
  noteContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
  },
  noteInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sendButton: {
    backgroundColor: '#2a5298',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});