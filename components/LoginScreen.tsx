import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useLoginWithEmail } from '@privy-io/expo'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

export const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { state, sendCode, loginWithCode } = useLoginWithEmail({
    onSendCodeSuccess({ email }) {
      console.log(`OTP sent to ${email}`)
    },
    onLoginSuccess(user, isNewUser) {
      console.log(`User logged in: ${user.email}, New User: ${isNewUser}`)
    },
    onError(error) {
      console.error('Error during login flow:', error)
    },
  })

  const isEmailFlow = state.status !== 'initial' && state.status !== 'error'

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
              />
            </View>
						{state.status === "sending-code" && (
						<Text style={styles.signInButtonText}>Sending Code...</Text>
						)}
						</>
					) : (
						<>
						<>
					<TextInput
						value={code}
						onChangeText={setCode}
						placeholder="Code"
						placeholderTextColor="#666"
						style={styles.input}
						inputMode="numeric"
					/>
					<TouchableOpacity
						style={styles.signInButton}
						disabled={state.status !== "awaiting-code-input"}
						onPress={() => loginWithCode({ code, email })}
					>
						<FontAwesome name="key" size={24} color="black" />
						<Text style={styles.signInButtonText}>Login</Text>
					</TouchableOpacity>
					{state.status === "submitting-code" && (
						<Text style={styles.signInButtonText}>Logging in...</Text>
					)}
				</>
						</>
						)}
            {/* <View style={styles.inputContainer}>
              <FontAwesome
                name="lock"
                size={20}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="Password"
                placeholderTextColor="#666"
                style={styles.input}
                secureTextEntry
              />
            </View> */}

            <TouchableOpacity
              style={[
                styles.signInButton,
                state.status === "sending-code" && styles.signInButtonDisabled,
              ]}
							disabled={state.status === "sending-code"}
							onPress={() => sendCode({ email })}
            >
              <Text style={styles.signInButtonText}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Text>
            </TouchableOpacity>
            {!isEmailFlow && (
              <>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity style={styles.socialButton}>
                  <FontAwesome name="apple" size={20} color="#000" />
                  <Text style={styles.socialButtonText}>
                    Continue with Apple
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton}>
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
            <Text style={styles.footerText}>Don't have an account? </Text>
            {/* <Link href="/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign up</Text>
              </TouchableOpacity>
            </Link> */}
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
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 24,
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
  },
  footerText: {
    color: '#E0E0E0',
    fontSize: 14,
  },
  footerLink: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
