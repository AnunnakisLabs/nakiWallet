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

export default function TermsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.lastUpdated}>Last updated: March 15, 2024</Text>

          <View style={styles.article}>
            <Text style={styles.articleTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.articleText}>
              By accessing and using the Naki application ("the App"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the App.
            </Text>
          </View>

          <View style={styles.article}>
            <Text style={styles.articleTitle}>2. Account Registration</Text>
            <Text style={styles.articleText}>
              2.1. You must be at least 18 years old to create an account.{'\n\n'}
              2.2. You are responsible for maintaining the confidentiality of your account credentials.{'\n\n'}
              2.3. You agree to provide accurate and complete information during registration.
            </Text>
          </View>

          <View style={styles.article}>
            <Text style={styles.articleTitle}>3. Services</Text>
            <Text style={styles.articleText}>
              3.1. The App provides digital payment and money transfer services.{'\n\n'}
              3.2. We reserve the right to modify or discontinue any service at any time.{'\n\n'}
              3.3. Service availability may vary by region and is subject to applicable laws.
            </Text>
          </View>

          <View style={styles.article}>
            <Text style={styles.articleTitle}>4. Fees and Charges</Text>
            <Text style={styles.articleText}>
              4.1. Fees for our services are clearly displayed before each transaction.{'\n\n'}
              4.2. We may modify our fee structure with prior notice.{'\n\n'}
              4.3. You are responsible for all applicable taxes and third-party charges.
            </Text>
          </View>

          <View style={styles.article}>
            <Text style={styles.articleTitle}>5. Privacy and Security</Text>
            <Text style={styles.articleText}>
              5.1. Your privacy is governed by our Privacy Policy.{'\n\n'}
              5.2. You agree to use reasonable security measures to protect your account.{'\n\n'}
              5.3. We employ industry-standard security measures to protect your data.
            </Text>
          </View>

          <View style={styles.article}>
            <Text style={styles.articleTitle}>6. Prohibited Activities</Text>
            <Text style={styles.articleText}>
              You agree not to:{'\n\n'}
              • Use the App for illegal purposes{'\n'}
              • Attempt to gain unauthorized access{'\n'}
              • Interfere with the App's functionality{'\n'}
              • Submit false or misleading information{'\n'}
              • Engage in fraudulent activities
            </Text>
          </View>

          <View style={styles.article}>
            <Text style={styles.articleTitle}>7. Limitation of Liability</Text>
            <Text style={styles.articleText}>
              7.1. We are not liable for any indirect, incidental, or consequential damages.{'\n\n'}
              7.2. Our liability is limited to the amount of fees paid for the specific service in question.
            </Text>
          </View>

          <View style={styles.article}>
            <Text style={styles.articleTitle}>8. Changes to Terms</Text>
            <Text style={styles.articleText}>
              We may update these terms at any time. Continued use of the App after changes constitutes acceptance of the new terms.
            </Text>
          </View>

          <View style={styles.article}>
            <Text style={styles.articleTitle}>9. Contact Information</Text>
            <Text style={styles.articleText}>
              For questions about these terms, please contact us at:{'\n'}
              support@naki.app
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