import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

export default function NFCPaymentScreen() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [nfcSupported, setNfcSupported] = useState(false);
  const pulseAnim = new Animated.Value(1);
  const pulseScale = new Animated.Value(1);
  const pulseOpacity = new Animated.Value(1);

  const startPulseAnimation = () => {
    // Icon pulse animation
    Animated.loop(
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
    ).start();

    // Ripple effect animation
    Animated.loop(
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
    ).start();
  };

  React.useEffect(() => {
    if (isScanning) {
      startPulseAnimation();
    } else {
      pulseAnim.setValue(1);
      pulseScale.setValue(1);
      pulseOpacity.setValue(1);
      Animated.stopAnimation();
    }
  }, [isScanning]);

  const handleSuccessfulPayment = async () => {
    setIsScanning(false);
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    Alert.alert(
      'Payment Successful',
      'Your payment has been processed successfully.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleFailedPayment = async (error) => {
    setIsScanning(false);
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    Alert.alert(
      'Payment Failed',
      'There was an error processing your payment. Please try again.'
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>NFC Payment</Text>
        <View style={styles.placeholder} />
      </View>

      {/* NFC Scan Area */}
      <View style={styles.scanArea}>
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
            ? 'Hold your device near the payment terminal'
            : 'Tap the button below to start scanning'}
        </Text>

        <TouchableOpacity
          style={[styles.scanButton, isScanning && styles.scanningButton]}
          onPress={() => {
            setIsScanning(true);
            // Simulate a successful payment after 3 seconds
            setTimeout(() => {
              handleSuccessfulPayment();
            }, 3000);
          }}
          disabled={isScanning}
        >
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Scanning...' : 'Start NFC Scan'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>How to pay with NFC</Text>
        
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
            Tap 'Start NFC Scan' to begin the payment process
          </Text>
        </View>

        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <Text style={styles.stepText}>
            Hold your device near the payment terminal until you feel a vibration
          </Text>
        </View>
      </View>
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
    paddingVertical: 40,
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
    marginTop: 'auto',
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