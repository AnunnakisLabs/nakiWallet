import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  Animated,
  Easing,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

export default function NFCPaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isScanning, setIsScanning] = useState(false);
  const [amount, setAmount] = useState(params.amount ? String(params.amount) : '');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<'send' | 'receive'>('send');
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const pulseScale = React.useRef(new Animated.Value(1)).current;
  const pulseOpacity = React.useRef(new Animated.Value(1)).current;

  const quickAmounts = ['$5', '$10', '$20', '$50', '$100'];

  const startPulseAnimation = () => {
    const iconPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    const ripplePulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.5,
            duration: 1500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, {
            toValue: 0,
            duration: 1500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    iconPulse.start();
    ripplePulse.start();

    return () => {
      iconPulse.stop();
      ripplePulse.stop();
    };
  };

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (isScanning) {
      cleanup = startPulseAnimation();
    } else {
      pulseAnim.setValue(1);
      pulseScale.setValue(1);
      pulseOpacity.setValue(1);
    }

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [isScanning]);

  const handleStartScan = () => {
    if (paymentType === 'send' && (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0)) {
      setError('Please enter a valid amount');
      return;
    }

    setError(null);
    setIsScanning(true);
    
    // Simulate a successful payment after 3 seconds
    setTimeout(() => {
      handleSuccessfulPayment();
    }, 3000);
  };

  const handleSuccessfulPayment = async () => {
    setIsScanning(false);
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    Alert.alert(
      'Success',
      paymentType === 'send'
        ? `Your payment of $${parseFloat(amount).toFixed(2)} has been sent successfully.`
        : 'Ready to receive payment. Hold the payment device near your phone.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  // Web platform unsupported message
  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>NFC Payment</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.webUnsupported}>
          <FontAwesome name="exclamation-circle" size={50} color="#fff" />
          <Text style={styles.webUnsupportedTitle}>NFC Not Available</Text>
          <Text style={styles.webUnsupportedText}>
            NFC payments are not supported in web browsers. Please use the mobile app to access this feature.
          </Text>
          <TouchableOpacity
            style={styles.backToPaymentsButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backToPaymentsText}>Back to Payments</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>NFC Payment</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Payment Type Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, paymentType === 'send' && styles.activeTab]}
            onPress={() => setPaymentType('send')}
          >
            <FontAwesome 
              name="paper-plane" 
              size={16} 
              color={paymentType === 'send' ? '#8134AF' : '#fff'} 
              style={styles.tabIcon}
            />
            <Text style={[styles.tabText, paymentType === 'send' && styles.activeTabText]}>
              Send
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, paymentType === 'receive' && styles.activeTab]}
            onPress={() => setPaymentType('receive')}
          >
            <FontAwesome 
              name="download" 
              size={16} 
              color={paymentType === 'receive' ? '#8134AF' : '#fff'} 
              style={styles.tabIcon}
            />
            <Text style={[styles.tabText, paymentType === 'receive' && styles.activeTabText]}>
              Receive
            </Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Amount Input - Only show for send */}
        {paymentType === 'send' && (
          <>
            <View style={styles.amountContainer}>
              <Text style={styles.dollarSign}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor="#B39DDB"
                editable={!isScanning}
              />
            </View>

            {/* Quick Amounts */}
            {!isScanning && (
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
            )}

            {/* Note Input */}
            {!isScanning && (
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
            )}
          </>
        )}

        {/* NFC Scan Area */}
        <View style={[styles.scanArea, paymentType === 'receive' && styles.scanAreaReceive]}>
          <View style={styles.nfcCircleContainer}>
            <Animated.View
              style={[
                styles.pulseCircle,
                {
                  transform: [{ scale: pulseScale }],
                  opacity: pulseOpacity,
                },
              ]}
            />
            <LinearGradient
              colors={['#8134AF', '#9C27B0']}
              style={styles.nfcCircle}
            >
              <Animated.View 
                style={[
                  styles.nfcIconContainer,
                  { 
                    opacity: pulseAnim,
                    transform: [
                      { scale: Animated.multiply(pulseAnim, 1.1) }
                    ]
                  }
                ]}
              >
                <FontAwesome
                  name="wifi"
                  size={50}
                  color="#fff"
                  style={styles.nfcIcon}
                />
              </Animated.View>
            </LinearGradient>
          </View>

          <Text style={styles.scanTitle}>
            {isScanning ? 'Scanning...' : 'Ready to Scan'}
          </Text>
          <Text style={styles.scanDescription}>
            {isScanning
              ? paymentType === 'send'
                ? 'Hold your device near the payment terminal'
                : 'Hold the payment device near your phone'
              : paymentType === 'send'
                ? 'Enter amount and tap the button below to start scanning'
                : 'Tap the button below to start receiving payment'}
          </Text>

          <TouchableOpacity
            style={[styles.scanButton, isScanning && styles.scanningButton]}
            onPress={handleStartScan}
            disabled={isScanning}
          >
            {isScanning ? (
              <ActivityIndicator color="#8134AF" />
            ) : (
              <Text style={styles.scanButtonText}>
                {paymentType === 'send' ? 'Start Payment' : 'Start Receiving'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>
            How to {paymentType === 'send' ? 'pay' : 'receive'} with NFC
          </Text>
          
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>
              Enable NFC on your device if it's not already enabled
            </Text>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>
              {paymentType === 'send'
                ? "Enter the payment amount and tap 'Start Payment'"
                : "Tap 'Start Receiving' to begin"}
            </Text>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>
              {paymentType === 'send'
                ? 'Hold your device near the payment terminal until you feel a vibration'
                : 'Hold the payment device near your phone until you feel a vibration'}
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
  placeholder: {
    width: 40,
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
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
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
  quickAmountsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
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
  webUnsupported: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  webUnsupportedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  webUnsupportedText: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: 30,
  },
  backToPaymentsButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
  },
  backToPaymentsText: {
    color: '#8134AF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scanArea: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  scanAreaReceive: {
    marginTop: 40,
  },
  nfcCircleContainer: {
    position: 'relative',
    width: 200,
    height: 200,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  nfcCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nfcIconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nfcIcon: {
    transform: [{ rotate: '45deg' }],
  },
  scanTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  scanDescription: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  scanButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
  },
  scanningButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  scanButtonText: {
    color: '#8134AF',
    fontSize: 16,
    fontWeight: 'bold',
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