import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useLoginWithEmail } from '@privy-io/expo'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { LinearGradient } from 'expo-linear-gradient'

export const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  // Privy authentication hook for email
  const { state: emailState, sendCode, loginWithCode } = useLoginWithEmail({
    onSendCodeSuccess({ email }) {
      console.log(`OTP sent to ${email}`)
    },
    onLoginSuccess(user, isNewUser) {
      // Find linked email account if it exists
      const emailAccount = user.linked_accounts.find(account => account.type === 'email');
      const emailAddress = emailAccount ? emailAccount.address : 'unknown';
      
      console.log(`User logged in: ${emailAddress}, New User: ${isNewUser}`)
    },
    onError(error) {
      console.error('Error during login flow:', error)
      setError(error.message || 'Login error')
    },
  })

  const isEmailFlow = emailState.status !== 'initial' && emailState.status !== 'error'
  const isLoading = emailState.status === 'sending-code' || emailState.status === 'submitting-code'

  return (
    <LinearGradient
      colors={['#8134AF', '#9C27B0']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>naki</Text>
              <Text style={styles.walletText}>WALLET</Text>
            </View>
            
            <View style={styles.formContainer}>
              <Text style={styles.subtitle}>
                The simplest digital wallet
              </Text>
              
              {!isEmailFlow ? (
                <>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputContainer}>
                      <FontAwesome
                        name="envelope-o"
                        size={20}
                        color="#8134AF"
                        style={styles.inputIcon}
                      />
                      <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email address"
                        placeholderTextColor="#8888"
                        style={styles.input}
                        inputMode="email"
                        autoCapitalize="none"
                        editable={!isLoading}
                      />
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    style={[
                      styles.signInButton,
                      (isLoading || !email) && styles.signInButtonDisabled,
                    ]}
                    disabled={isLoading || !email}
                    onPress={() => sendCode({ email })}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <>
                        <Text style={styles.signInButtonText}>
                          Continue
                        </Text>
                        <FontAwesome name="arrow-right" size={16} color="#fff" style={styles.buttonIcon} />
                      </>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={styles.codeContainer}>
                    <Text style={styles.codeInstructions}>
                      We've sent a code to <Text style={styles.emailHighlight}>{email}</Text>
                    </Text>
                    
                    <View style={styles.inputWrapper}>
                      <View style={styles.inputContainer}>
                        <FontAwesome
                          name="key"
                          size={20}
                          color="#8134AF"
                          style={styles.inputIcon}
                        />
                        <TextInput
                          value={code}
                          onChangeText={setCode}
                          placeholder="Enter verification code"
                          placeholderTextColor="#8888"
                          style={styles.input}
                          inputMode="numeric"
                          editable={!isLoading}
                        />
                      </View>
                    </View>
                    
                    <TouchableOpacity
                      style={[
                        styles.signInButton,
                        (isLoading || !code) && styles.signInButtonDisabled,
                      ]}
                      disabled={isLoading || !code}
                      onPress={() => loginWithCode({ code, email })}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <>
                          <Text style={styles.signInButtonText}>Sign In</Text>
                          <FontAwesome name="arrow-right" size={16} color="#fff" style={styles.buttonIcon} />
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              )}
              
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {isEmailFlow 
                  ? "Didn't receive the code? " 
                  : "Your email is the gateway to a secure digital wallet"}
              </Text>
              {isEmailFlow && (
                <TouchableOpacity onPress={() => sendCode({ email })}>
                  <Text style={styles.footerLink}>Resend</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 70,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  walletText: {
    fontSize: 16,
    color: '#fff',
    letterSpacing: 4,
    marginTop: -5,
  },
  formContainer: {
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '500',
  },
  inputWrapper: {
    borderRadius: 16,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      },
    }),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 60,
    color: '#333',
    fontSize: 16,
    paddingVertical: 12,
  },
  signInButton: {
    backgroundColor: '#5B2C8D',
    borderRadius: 16,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      },
    }),
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  codeContainer: {
    marginBottom: 20,
  },
  codeInstructions: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  emailHighlight: {
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  footerLink: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.3)',
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});