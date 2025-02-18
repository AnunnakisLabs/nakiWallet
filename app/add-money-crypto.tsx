import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';

const CryptoOption = ({ icon, name, symbol, price, selected, onSelect }) => (
  <TouchableOpacity 
    style={[styles.cryptoOption, selected && styles.cryptoOptionSelected]} 
    onPress={onSelect}
  >
    <View style={styles.cryptoIcon}>
      <FontAwesome name={icon} size={24} color="#8134AF" />
    </View>
    <View style={styles.cryptoInfo}>
      <Text style={styles.cryptoName}>{name}</Text>
      <Text style={styles.cryptoSymbol}>{symbol}</Text>
    </View>
    <Text style={styles.cryptoPrice}>${price}</Text>
    {selected && (
      <View style={styles.selectedCheck}>
        <FontAwesome name="check" size={12} color="#fff" />
      </View>
    )}
  </TouchableOpacity>
);

export default function AddMoneyCryptoScreen() {
  const router = useRouter();
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [walletAddress] = useState('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh');

  const cryptoOptions = [
    { icon: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: '43,567.89' },
    { icon: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: '2,345.67' },
    { icon: 'dollar', name: 'USDT', symbol: 'USDT', price: '1.00' },
  ];

  const handleCryptoSelect = (symbol) => {
    setSelectedCrypto(symbol);
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      alert('Address copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crypto Deposit</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.cryptoSelectionContainer}>
          <Text style={styles.sectionTitle}>Select Cryptocurrency</Text>
          {cryptoOptions.map((crypto) => (
            <CryptoOption
              key={crypto.symbol}
              {...crypto}
              selected={selectedCrypto === crypto.symbol}
              onSelect={() => handleCryptoSelect(crypto.symbol)}
            />
          ))}
        </View>

        <View style={styles.walletContainer}>
          <Text style={styles.sectionTitle}>Deposit Address</Text>
          <LinearGradient
            colors={['#8134AF', '#9C27B0']}
            style={styles.walletCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.walletLabel}>
              Your {selectedCrypto} Address:
            </Text>
            <View style={styles.addressContainer}>
              <Text style={styles.walletAddress}>
                {walletAddress}
              </Text>
              <TouchableOpacity 
                style={styles.copyButton}
                onPress={handleCopyAddress}
              >
                <FontAwesome name="copy" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.qrContainer}>
              <QRCode
                value={walletAddress}
                size={120}
                color="#000"
                backgroundColor="#fff"
              />
            </View>
          </LinearGradient>
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.sectionTitle}>How to Deposit</Text>
          <View style={styles.instruction}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>1</Text>
            </View>
            <Text style={styles.instructionText}>
              Copy the deposit address or scan the QR code
            </Text>
          </View>
          <View style={styles.instruction}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>2</Text>
            </View>
            <Text style={styles.instructionText}>
              Send any amount from your crypto wallet
            </Text>
          </View>
          <View style={styles.instruction}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>3</Text>
            </View>
            <Text style={styles.instructionText}>
              Wait for the network confirmation (usually 10-30 minutes)
            </Text>
          </View>
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
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 36,
  },
  content: {
    flex: 1,
  },
  cryptoSelectionContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  cryptoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F8F4FF',
    borderRadius: 12,
    marginBottom: 10,
  },
  cryptoOptionSelected: {
    backgroundColor: '#F0E6FF',
    borderColor: '#8134AF',
    borderWidth: 1,
  },
  cryptoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cryptoInfo: {
    flex: 1,
  },
  cryptoName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  cryptoSymbol: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  cryptoPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8134AF',
  },
  selectedCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#8134AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  walletContainer: {
    backgroundColor: '#fff',
    padding: 20,
  },
  walletCard: {
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
  walletLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  walletAddress: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    marginRight: 12,
  },
  copyButton: {
    padding: 8,
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },
  instructionsContainer: {
    backgroundColor: '#fff',
    padding: 20,
  },
  instruction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
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
});