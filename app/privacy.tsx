import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.lastUpdated}>Last updated: March 15, 2024</Text>

          <View style={styles.article}>
            <Text style={styles.articleTitle}>1. Introduction</Text>
            <Text style={styles.articleText}>
              This Privacy Policy explains how Naki ("we," "us," or "our") collects, uses, and protects your personal information when you use our mobile application and services.
            </Text>
          </View>

          <View style={styles.article}>
            <Text style={styles.articleTitle}>2. Information We Collect</Text>
            <Text style={styles.articleText}>
              2.1. Personal Information:{'\n'}
              • Name and contact details{'\n'}
              • Date of birth{'\n'}
              • Government ID information{'\n'}
              • Banking and financial information{'\n'}
              • Device information and IP address{'\n\n'}
              2.2. Transaction Information:{'\n'}
              • Payment history{'\n'}
              • Transfer details{'\n'}
              • Account balances{'\n'}
              • Transaction patterns
            </Text>
          </View>

          <View style={styles.article}>
            <Text style={styles.articleTitle}>3. How We Use Your Information</Text>
            <Text style={styles.articleText}>
              We use your information to:{'\n\n'}
              • Process transactions{'\n'}
              • Verify your identity{'\n'}
              • Prevent fraud{'\n'}
              • Improve our services{'\n'}
              • Communicate with you{'\n'}
              • Comply with legal requirements
            </Text>
          </View>

          <View style={styles.article}>
            <Text style={styles.articleTitle}>4. Data Security</Text>
            <Text style={styles.articleText}>
              4.1. We implement appropriate technical and organizational measures to protect your personal information.{'\n\n'}
              4.2. We use encryption, secure servers, and regular security assessments.{'\n\n'}
              4.3. While we take all reasonable precautions, no security measure is completely impenetrable.
            </Text>
          </View>

          <View style={styles.article}>
            <Text style={styles.articleTitle}>5. Data Sharing</Text>
            <Text style={styles.articleText}>
              We may share your information with:{'\n\n'}
              • Payment processors{'\n'}
              • Identity verification services{'\n'}
              • Regulatory authorities{'\n'}
              • Law enforcement when required{'\n\n'}
              We do not sell your personal information to third parties.
            </Text>
          </View>

          <View style={styles.article}>
            <Text style={styles.articleTitle}>6. Your Rights</Text>
            <Text style={styles.articleText}>
              You have the right to:{'\n\n'}
              • Access your personal information{'\n'}
              • Correct inaccurate data{'\n'}
              • Request data deletion{'\n'}
              • Opt-out of marketing communications{'\n'}
              • Data portability
            </Text>
          </View>

          <View style={styles.article}>
            <Text style={styles.articleTitle}>7. Cookies and Tracking</Text>
            <Text style={styles.articleText}>
              We use cookies and similar technologies to:{'\ n'}
              • Improve user experience{'\n'}
              • Analyze app usage{'\n'}
              • Remember your preferences{'\n'}
              • Enhance security
            </Text>
          </View>

          <View style={styles.article}>
            <Text style={styles.articleTitle}>8. Children's Privacy</Text>
            <Text style={styles.articleText}>
              Our services are not intended for children under 18. We do not knowingly collect information from children under 18.
            </Text>
          </View>

          <View style={styles.article}>
            <Text style={styles.articleTitle}>9. International Data Transfers</Text>
            <Text style={styles.articleText}>
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
            </Text>
          </View>

          <View style={styles.article}>
            <Text style={styles.articleTitle}>10. Changes to Privacy Policy</Text>
            <Text style={styles.articleText}>
              We may update this policy periodically. We will notify you of any material changes through the app or email.
            </Text>
          </View>

          <View style={styles.article}>
            <Text style={styles.articleTitle}>11. Contact Us</Text>
            <Text style={styles.articleText}>
              For privacy-related questions or concerns, contact us at:{'\n'}
              privacy@naki.app
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
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  section: {
    padding: 20,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  article: {
    marginBottom: 24,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  articleText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});