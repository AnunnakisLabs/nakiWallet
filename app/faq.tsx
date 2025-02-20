import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const FAQItem = ({ question, answer }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <TouchableOpacity 
      style={styles.faqItem}
      onPress={() => setIsExpanded(!isExpanded)}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{question}</Text>
        <FontAwesome 
          name={isExpanded ? 'chevron-up' : 'chevron-down'} 
          size={16} 
          color="#666" 
        />
      </View>
      {isExpanded && (
        <Text style={styles.faqAnswer}>{answer}</Text>
      )}
    </TouchableOpacity>
  );
};

export default function FAQScreen() {
  const router = useRouter();
  const faqs = [
    {
      question: 'How do I add money to my account?',
      answer: 'You can add money to your account through various methods including bank transfer, debit card, or PayPal. Go to the "Add Money" section and choose your preferred payment method.',
    },
    {
      question: 'Is my money safe?',
      answer: 'Yes, your funds are secure. We use industry-standard encryption and security measures to protect your transactions and personal information. Additionally, we are fully regulated and compliant with financial regulations.',
    },
    {
      question: 'How long do transfers take?',
      answer: 'Transfer times vary by method. Bank transfers typically take 1-3 business days, while card payments and PayPal transfers are usually instant.',
    },
    {
      question: 'What are the fees?',
      answer: 'We maintain transparent pricing with no hidden fees. Standard transfers are free, while instant transfers may incur a small fee. Check our fee schedule for detailed information.',
    },
    {
      question: 'Can I use my account internationally?',
      answer: 'Yes, you can use your account for international transfers and payments. Please note that international transactions may have additional fees and exchange rates will apply.',
    },
    {
      question: 'What if I lose my phone?',
      answer: 'If you lose your phone, you can immediately lock your account by contacting our support team. You can also access your account through our web platform using two-factor authentication.',
    },
    {
      question: 'How do I verify my identity?',
      answer: "To verify your identity, you will need to provide a government-issued ID and proof of address. This can be done through the app by following the verification steps in your profile settings.",
    },
    {
      question: 'What if I forget my password?',
      answer: 'You can reset your password through the login screen by clicking "Forgot Password" and following the instructions sent to your registered email address.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQ</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={16} color="#666" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Search FAQs</Text>
        </View>

        <View style={styles.categoriesContainer}>
          <TouchableOpacity style={[styles.categoryButton, styles.activeCategoryButton]}>
            <Text style={[styles.categoryText, styles.activeCategoryText]}>General</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>Payments</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>Security</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.faqList}>
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </View>

        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>Still need help?</Text>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => router.push('/contact')}
          >
            <FontAwesome name="envelope" size={20} color="#8134AF" />
            <Text style={styles.contactButtonText}>Contact Support</Text>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    padding: 12,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  searchIcon: {
    marginRight: 12,
  },
  searchPlaceholder: {
    color: '#666',
    fontSize: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: 'rgba(129, 52, 175, 0.1)',
  },
  activeCategoryButton: {
    backgroundColor: '#8134AF',
  },
  categoryText: {
    color: '#8134AF',
    fontSize: 14,
    fontWeight: '600',
  },
  activeCategoryText: {
    color: '#fff',
  },
  faqList: {
    padding: 20,
  },
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 12,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    lineHeight: 20,
  },
  supportSection: {
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  contactButtonText: {
    color: '#8134AF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});