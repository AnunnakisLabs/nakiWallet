import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

const RecentContact = ({ image, name }) => (
  <TouchableOpacity style={styles.recentContact}>
    <Image source={{ uri: image }} style={styles.recentContactImage} />
    <Text style={styles.recentContactName}>{name}</Text>
  </TouchableOpacity>
);

export default function PaymentScreen() {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const recentContacts = [
    { id: 1, name: 'Anouk', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120' },
    { id: 2, name: 'Ruben', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120' },
    { id: 3, name: 'Veronica', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' },
    { id: 4, name: 'Pablo', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120' },
  ];

  const quickAmounts = ['$5', '$10', '$20', '$50', '$100'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.backButton}>
              <FontAwesome name="arrow-left" size={20} color="#fff" />
            </TouchableOpacity>
          </Link>
          <Text style={styles.headerTitle}>Send Money</Text>
          <TouchableOpacity style={styles.scanButton}>
            <FontAwesome name="qrcode" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Recent Contacts */}
        <View style={styles.recentContactsContainer}>
          <Text style={styles.sectionTitle}>Recent</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentContactsScroll}>
            {recentContacts.map((contact) => (
              <RecentContact key={contact.id} image={contact.image} name={contact.name} />
            ))}
          </ScrollView>
        </View>

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
          <TouchableOpacity style={styles.requestButton}>
            <Text style={styles.buttonText}>Request</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.payButton}>
            <Text style={styles.buttonText}>Pay</Text>
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
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scanButton: {
    padding: 8,
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});