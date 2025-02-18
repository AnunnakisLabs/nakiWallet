import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function AddMoneyBankScreen() {
  const router = useRouter();
  const bankDetails = {
    accountName: 'Naki Finance Inc.',
    accountNumber: '1234567890',
    routingNumber: '021000021',
    bankName: 'Chase Bank',
    swiftCode: 'CHASUS33',
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      Alert.alert('Copied!', `${label} copied to clipboard`);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShare = async () => {
    const message = `Bank Transfer Details:\n\n` +
      `Account Name: ${bankDetails.accountName}\n` +
      `Account Number: ${bankDetails.accountNumber}\n` +
      `Routing Number: ${bankDetails.routingNumber}\n` +
      `Bank: ${bankDetails.bankName}\n` +
      `SWIFT Code: ${bankDetails.swiftCode}`;

    try {
      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({
            title: 'Bank Transfer Details',
            text: message,
          });
        } else {
          await navigator.clipboard.writeText(message);
          Alert.alert('Copied!', 'Bank details copied to clipboard');
        }
      } else {
        await Share.share({
          message,
        });
      }
    } catch (error) {
      console.error('Share error:', error);
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
          <Text style={styles.headerTitle}>Bank Transfer</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <FontAwesome name="share-alt" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Bank Details Card */}
        <View style={styles.bankDetailsSection}>
          <LinearGradient
            colors={['#8134AF', '#9C27B0']}
            style={styles.bankCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.bankHeader}>
              <Text style={styles.bankTitle}>Bank Account Details</Text>
              <FontAwesome name="bank" size={24} color="#fff" />
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Account Name</Text>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>{bankDetails.accountName}</Text>
                <TouchableOpacity 
                  onPress={() => handleCopy(bankDetails.accountName, 'Account name')}
                  style={styles.copyButton}
                >
                  <FontAwesome name="copy" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Account Number</Text>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>{bankDetails.accountNumber}</Text>
                <TouchableOpacity 
                  onPress={() => handleCopy(bankDetails.accountNumber, 'Account number')}
                  style={styles.copyButton}
                >
                  <FontAwesome name="copy" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Routing Number</Text>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>{bankDetails.routingNumber}</Text>
                <TouchableOpacity 
                  onPress={() => handleCopy(bankDetails.routingNumber, 'Routing number')}
                  style={styles.copyButton}
                >
                  <FontAwesome name="copy" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Bank Name</Text>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>{bankDetails.bankName}</Text>
                <TouchableOpacity 
                  onPress={() => handleCopy(bankDetails.bankName, 'Bank name')}
                  style={styles.copyButton}
                >
                  <FontAwesome name="copy" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>SWIFT Code</Text>
              <View style={styles.detailValueContainer}>
                <Text style={styles.detailValue}>{bankDetails.swiftCode}</Text>
                <TouchableOpacity 
                  onPress={() => handleCopy(bankDetails.swiftCode, 'SWIFT code')}
                  style={styles.copyButton}
                >
                  <FontAwesome name="copy" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>How to Add Money</Text>
          
          <View style={styles.instruction}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>1</Text>
            </View>
            <Text style={styles.instructionText}>
              Copy the bank account details above
            </Text>
          </View>

          <View style={styles.instruction}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>2</Text>
            </View>
            <Text style={styles.instructionText}>
              Log in to your bank's website or mobile app
            </Text>
          </View>

          <View style={styles.instruction}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>3</Text>
            </View>
            <Text style={styles.instructionText}>
              Set up a new payee/recipient using the provided details
            </Text>
          </View>

          <View style={styles.instruction}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>4</Text>
            </View>
            <Text style={styles.instructionText}>
              Initiate the transfer for your desired amount
            </Text>
          </View>

          <View style={styles.instruction}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>5</Text>
            </View>
            <Text style={styles.instructionText}>
              Funds will be credited to your account within 1-3 business days
            </Text>
          </View>
        </View>

        {/* Note */}
        <View style={styles.noteContainer}>
          <FontAwesome name="info-circle" size={20} color="#666" />
          <Text style={styles.noteText}>
            Bank transfers typically take 1-3 business days to process. Contact support if you need assistance.
          </Text>
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
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankDetailsSection: {
    padding: 20,
  },
  bankCard: {
    padding: 20,
    borderRadius: 15,
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
  bankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  bankTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  detailValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    marginRight: 12,
  },
  copyButton: {
    padding: 8,
  },
  instructionsContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  instruction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8134AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    marginTop: 20,
  },
  noteText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});