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
import { useLoginWithEmail, useLoginWithOAuth } from '@privy-io/expo'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'

export const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  // Hooks de autenticación de Privy
  const { state: emailState, sendCode, loginWithCode } = useLoginWithEmail({
	onSendCodeSuccess({ email }) {
	  console.log(`OTP sent to ${email}`)
	},
	onLoginSuccess(user, isNewUser) {
	  // Encontrar la cuenta de email vinculada si existe
	  const emailAccount = user.linked_accounts.find(account => account.type === 'email');
	  const emailAddress = emailAccount ? emailAccount.address : 'unknown';
	  
	  console.log(`User logged in: ${emailAddress}, New User: ${isNewUser}`)
	},
	onError(error) {
	  console.error('Error during login flow:', error)
	  setError(error.message || 'Error al iniciar sesión')
	},
  })

  // Hook para autenticación OAuth (Google, Apple)
  const oauth = useLoginWithOAuth({
    onSuccess(user, isNewUser) {
      console.log(`User logged in via OAuth: ${user.id}, New User: ${isNewUser}`)
    },
    onError(error) {
      console.error('Error during OAuth login:', error)
      setError(error.message || 'Error al iniciar sesión con Google')
    },
  })

  const isEmailFlow = emailState.status !== 'initial' && emailState.status !== 'error'
  const isLoading = emailState.status === 'sending-code' || 
                    emailState.status === 'submitting-code' || 
                    oauth.state.status === 'loading'

  // Manejar inicio de sesión con Google
  const handleGoogleLogin = async () => {
    try {
      await oauth.login({ provider: 'google' })
    } catch (err) {
      console.error('Error logging in with Google:', err)
    }
  }

  // Manejar inicio de sesión con Apple
  const handleAppleLogin = async () => {
    try {
      await oauth.login({ provider: 'apple' })
    } catch (err) {
      console.error('Error logging in with Apple:', err)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Naki 👽</Text>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>
          
          <View style={styles.form}>
            {!isEmailFlow ? (
              <>
                <View style={styles.inputContainer}>
                  <FontAwesome
                    name="envelope-o"
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email address"
                    placeholderTextColor="#666"
                    style={styles.input}
                    inputMode="email"
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
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
  <Text style={styles.signInButtonText}>
    Enviar Código
  </Text>
)}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TextInput
                  value={code}
                  onChangeText={setCode}
                  placeholder="Enter verification code"
                  placeholderTextColor="#666"
                  style={styles.input}
                  inputMode="numeric"
                  editable={!isLoading}
                />
                
                <TouchableOpacity
                  style={[
                    styles.signInButton,
                    (isLoading || !code) && styles.signInButtonDisabled,
                  ]}
                  disabled={emailState.status !== "awaiting-code-input" || !code}
                  onPress={() => loginWithCode({ code, email })}
                >
                  {emailState.status === "submitting-code" ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.signInButtonText}>Iniciar Sesión</Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {!isEmailFlow && (
              <>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity 
                  style={styles.socialButton}
                  onPress={handleAppleLogin}
                  disabled={isLoading}
                >
                  <FontAwesome name="apple" size={20} color="#000" />
                  <Text style={styles.socialButtonText}>
                    Continue with Apple
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.socialButton}
                  onPress={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <FontAwesome name="google" size={20} color="#000" />
                  <Text style={styles.socialButtonText}>
                    Continue with Google
                  </Text>
                </TouchableOpacity>
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
                : "Don't have an account? Creating one is simple with your email."}
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8134AF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E0E0',
    marginBottom: 32,
  },
  form: {
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 4,
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#000',
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  signInButton: {
    backgroundColor: '#5B2C8D',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    color: '#fff',
    marginHorizontal: 16,
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  socialButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    flexWrap: 'wrap',
  },
  footerText: {
    color: '#E0E0E0',
    fontSize: 14,
    textAlign: 'center',
  },
  footerLink: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    textAlign: 'center',
  },
})