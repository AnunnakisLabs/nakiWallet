import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Share,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { LinearGradient } from 'expo-linear-gradient';

export default function ReceiveMoneyScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [activeMethod, setActiveMethod] = useState('qr');

  const user = {
    id: '12345',
    username: '@sasasamaes',
    name: 'Francisco campos',
  };

  const qrData = JSON.stringify({
    type: 'receive',
    userId: user.id,
    username: user.username,
    amount: amount ? parseFloat(amount) : undefined,
    note: note || undefined,
  });

  const handleShare = async () => {
    const shareUrl = `https://naki.app/pay/${user.username}${amount ? `?amount=${amount}` : ''}`;
    const shareText = `Pay me on Naki: ${shareUrl}`;

    try {
      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({
            title: 'Share Payment Link',
            text: shareText,
            url: shareUrl,
          });
        } else {
          await navigator.clipboard.writeText(shareText);
          alert('Payment link copied to clipboard');
        }
      } else {
        await Share.share({
          message: shareText,
          url: shareUrl,
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
          <Text style={styles.headerTitle}>Receive Money</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <FontAwesome name="share-alt" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Payment Methods */}
        <View style={styles.methodsContainer}>
          <TouchableOpacity 
            style={[styles.methodButton, activeMethod === 'qr' && styles.activeMethodButton]}
            onPress={() => setActiveMethod('qr')}
          >
            <FontAwesome 
              name="qrcode" 
              size={24} 
              color={activeMethod === 'qr' ? '#8134AF' : '#fff'} 
            />
            <Text style={[styles.methodText, activeMethod === 'qr' && styles.activeMethodText]}>
              QR Code
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.methodButton, activeMethod === 'nfc' && styles.activeMethodButton]}
            onPress={() => setActiveMethod('nfc')}
          >
            <FontAwesome 
              name="wifi" 
              size={24} 
              color={activeMethod === 'nfc' ? '#8134AF' : '#fff'} 
            />
            <Text style={[styles.methodText, activeMethod === 'nfc' && styles.activeMethodText]}>
              NFC
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View style={styles.amountContainer}>
          <Text style={styles.dollarSign}>$</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="decimal-pad"
            placeholderTextColor="#B39DDB"
          />
        </View>

        {/* Note Input */}
        <View style={styles.noteContainer}>
          <FontAwesome name="pencil" size={20} color="#666" style={styles.noteIcon} />
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="Add a note (optional)"
            placeholderTextColor="#666"
          />
        </View>

        {activeMethod === 'qr' ? (
          <View style={styles.qrContainer}>
            <LinearGradient
              colors={['#8134AF', '#9C27B0']}
              style={styles.qrBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.qrWrapper}>
                <QRCode
                  value={qrData}
                  size={200}
                  color="#000"
                  backgroundColor="#fff"
                />
              </View>
            </LinearGradient>
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.name}>{user.name}</Text>
          </View>
        ) : (
          <View style={styles.nfcContainer}>
            <View style={styles.nfcIcon}>
              <FontAwesome name="wifi" size={48} color="#8134AF" />
            </View>
            <Text style={styles.nfcTitle}>Ready to Receive</Text>
            <Text style={styles.nfcDescription}>
              Hold the sender's phone near yours to receive payment
            </Text>
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>
            How to receive money with {activeMethod === 'qr' ? 'QR Code' : 'NFC'}
          </Text>
          {activeMethod === 'qr' ? (
            <>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>
                  Enter the amount you want to receive (optional)
                </Text>
              </View>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>
                  Show this QR code to the person who wants to pay you
                </Text>
              </View>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>
                  They can scan it with their Naki app or phone camera
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>
                  Enter the amount you want to receive
                </Text>
              </View>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>
                  Make sure NFC is enabled on both devices
                </Text>
              </View>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>
                  Hold the sender's phone near yours until you feel a vibration
                </Text>
              </View>
            </>
          )}
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
  methodsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 12,
  },
  activeMethodButton: {
    backgroundColor: '#fff',
  },
  methodText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  activeMethodText: {
    color: '#8134AF',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
    minWidth: 150,
    textAlign: 'center',
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
  qrContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  qrBackground: {
    padding: 20,
    borderRadius: 20,
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
  qrWrapper: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  name: {
    fontSize: 16,
    color: '#E0E0E0',
    marginTop: 4,
  },
  nfcContainer: {
    alignItems: 'center',
    padding: 40,
  },
  nfcIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
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
  nfcTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  nfcDescription: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
  },
  instructions: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    marginTop: 20,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8134AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});