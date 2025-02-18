import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Share,
  Dimensions,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const QR_SIZE = width * 0.6;

export default function QRScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('receive');
  const user = {
    id: '12345',
    username: '@sasasamaes',
    name: 'Francisco campos',
  };

  const qrData = JSON.stringify({
    type: activeTab,
    userId: user.id,
    username: user.username,
  });

  const handleShare = async () => {
    const shareUrl = `https://naki.app/pay/${user.username}`;
    const shareText = `Pay me on Naki: ${shareUrl}`;

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
            console.error('Error sharing:', error);
          }
        }
      } else {
        try {
          await navigator.clipboard.writeText(shareText);
          alert('Payment link copied to clipboard!');
        } catch (error) {
          console.error('Error copying to clipboard:', error);
        }
      }
    } else {
      try {
        await Share.share({
          message: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My QR Code</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <FontAwesome name="share-alt" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'receive' && styles.activeTab]}
            onPress={() => setActiveTab('receive')}
          >
            <Text style={[styles.tabText, activeTab === 'receive' && styles.activeTabText]}>
              Receive Money
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'pay' && styles.activeTab]}
            onPress={() => setActiveTab('pay')}
          >
            <Text style={[styles.tabText, activeTab === 'pay' && styles.activeTabText]}>
              Pay
            </Text>
          </TouchableOpacity>
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
            {activeTab === 'receive' ? 'How to receive money' : 'How to pay'}
          </Text>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>
              {activeTab === 'receive'
                ? 'Show this QR code to the person who wants to pay you'
                : 'Open your camera and scan the QR code'}
            </Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>
              {activeTab === 'receive'
                ? 'They can scan it with their Naki app or phone camera'
                : 'Confirm the payment amount and recipient'}
            </Text>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>
              {activeTab === 'receive'
                ? 'Accept the payment when you receive the notification'
                : 'Complete the payment using your preferred payment method'}
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
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  shareButton: {
    padding: 8,
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
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#8134AF',
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
});