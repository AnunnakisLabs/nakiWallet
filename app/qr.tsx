import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Share,
  Dimensions,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const QR_SIZE = width * 0.6;

export default function QRScreen() {
  const router = useRouter();
  
  // Group all useState hooks together at the top
  const [activeTab, setActiveTab] = useState('receive');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = {
    id: '12345',
    username: '@sasasamaes',
    name: 'Francisco campos',
  };

  // Request camera permissions on mount
  useEffect(() => {
    if (Platform.OS !== 'web') {
      (async () => {
        try {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        } catch (err) {
          console.error('Failed to request camera permission:', err);
          setHasPermission(false);
        }
      })();
    }
  }, []);

  const qrData = JSON.stringify({
    type: activeTab,
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
          try {
            await navigator.share({
              title: 'Share Payment Link',
              text: shareText,
              url: shareUrl,
            });
          } catch (error) {
            if (error.name !== 'AbortError') {
              console.error('Share failed:', error);
              await navigator.clipboard.writeText(shareText);
              Alert.alert('Copied!', 'Payment link copied to clipboard');
            }
          }
        } else {
          await navigator.clipboard.writeText(shareText);
          Alert.alert('Copied!', 'Payment link copied to clipboard');
        }
      } else {
        await Share.share({
          message: shareText,
          url: shareUrl,
        });
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Could not share the payment link');
    }
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    try {
      setScanned(true);
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      try {
        const paymentData = JSON.parse(data);
        router.push({
          pathname: '/payment',
          params: {
            amount: paymentData.amount,
            note: paymentData.note,
            username: paymentData.username,
            type: paymentData.type === 'receive' ? 'send' : 'request'
          }
        });
      } catch (e) {
        console.error('Invalid QR code data:', e);
        setError('Invalid QR code format');
        Alert.alert('Error', 'Invalid QR code format');
      }

      setShowScanner(false);
      setScanned(false);
    } catch (error) {
      console.error('Scan error:', error);
      setError('Failed to scan QR code');
      Alert.alert('Error', 'Failed to scan QR code. Please try again.');
      setScanned(false);
    }
  };

  const handleScanTab = () => {
    setActiveTab('scan');
    setShowScanner(true);
    setError(null);
  };

  const handleReceiveTab = () => {
    setActiveTab('receive');
    setShowScanner(false);
    setError(null);
  };

  const renderCamera = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.webScannerPlaceholder}>
          <FontAwesome name="qrcode" size={64} color="#8134AF" />
          <Text style={styles.webScannerText}>
            QR code scanning is not available in web browsers.
          </Text>
          <TouchableOpacity
            style={styles.webScannerButton}
            onPress={() => setShowScanner(false)}
          >
            <Text style={styles.webScannerButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (hasPermission === false) {
      return (
        <View style={styles.centeredContent}>
          <Text style={styles.permissionText}>No access to camera</Text>
          <Text style={styles.permissionSubtext}>
            Please enable camera access in your device settings to scan QR codes.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
        <BarCodeScanner
          style={styles.camera}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerMarker} />
          </View>
          <Text style={styles.scannerInstructions}>
            Position the QR code within the frame
          </Text>
        </BarCodeScanner>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>QR Code</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <FontAwesome name="share-alt" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'receive' && styles.activeTab]}
            onPress={handleReceiveTab}
          >
            <FontAwesome 
              name="download" 
              size={16} 
              color={activeTab === 'receive' ? '#8134AF' : '#fff'} 
              style={styles.tabIcon}
            />
            <Text style={[styles.tabText, activeTab === 'receive' && styles.activeTabText]}>
              Receive Money
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'scan' && styles.activeTab]}
            onPress={handleScanTab}
          >
            <FontAwesome 
              name="qrcode" 
              size={16} 
              color={activeTab === 'scan' ? '#8134AF' : '#fff'} 
              style={styles.tabIcon}
            />
            <Text style={[styles.tabText, activeTab === 'scan' && styles.activeTabText]}>
              Scan to Pay
            </Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {activeTab === 'receive' ? (
          <>
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

            {/* QR Code Container */}
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
                    size={QR_SIZE}
                    color="#000"
                    backgroundColor="#fff"
                  />
                </View>
              </LinearGradient>
              <Text style={styles.username}>{user.username}</Text>
              <Text style={styles.name}>{user.name}</Text>
            </View>

            {/* Instructions */}
            <View style={styles.instructions}>
              <Text style={styles.instructionsTitle}>
                How to receive money
              </Text>
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
            </View>
          </>
        ) : (
          <View style={styles.scanContainer}>
            {!showScanner ? (
              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => setShowScanner(true)}
              >
                <FontAwesome name="camera" size={32} color="#8134AF" />
                <Text style={styles.scanButtonText}>Tap to Scan QR Code</Text>
              </TouchableOpacity>
            ) : (
              renderCamera()
            )}

            <View style={styles.instructions}>
              <Text style={styles.instructionsTitle}>
                How to scan QR codes
              </Text>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>
                  Tap the camera button to start scanning
                </Text>
              </View>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>
                  Position the QR code within the frame
                </Text>
              </View>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>
                  Hold steady until the code is scanned
                </Text>
              </View>
            </View>
          </View>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#8134AF',
    zIndex: 1,
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 20,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabIcon: {
    marginRight: 8,
  },
  tabText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
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
  scanContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  scanButton: {
    backgroundColor: '#F8F4FF',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8134AF',
    marginTop: 12,
  },
  instructions: {
    backgroundColor: '#fff',
    margin: 20,
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
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  cameraContainer: {
    flex: 1,
    minHeight: 300,
    overflow: 'hidden',
    borderRadius: 15,
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerMarker: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 12,
  },
  scannerInstructions: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 16,
  },
  webScannerPlaceholder: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F4FF',
    borderRadius: 15,
    marginBottom: 20,
  },
  webScannerText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  webScannerButton: {
    backgroundColor: '#8134AF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  webScannerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centeredContent: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F4FF',
    borderRadius: 15,
    marginBottom: 20,
    padding: 20,
  },
  permissionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8134AF',
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});