import * as React from 'react'

import { Text, View, 
  KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Alert } from 'react-native'
  
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { useTheme } from '@react-navigation/native'
import { Sizes, Colors as colors } from '@/constants'
import { Button, Input } from '@/components'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()
  const { colors: Colors, fonts: Fonts } = useTheme()

  const [emailAddress, setEmailAddress] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false);
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  // Move ALL hooks to the top, before any conditional logic
  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      
    },
    content: {
      flex: 1,
      
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: Sizes.lg,
      paddingTop: Sizes.lg,
      paddingBottom: Sizes.xxl,
      justifyContent: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: Sizes.xl,
    },
    logo: {
      fontSize: 48,
      fontWeight: Fonts.bold.fontWeight,
      color: Colors.primary,
      marginBottom: Sizes.md,
    },
    title: {
      fontSize: Sizes.fontTitle,
      fontWeight: Fonts.bold.fontWeight,
      color: Colors.text,
      marginBottom: Sizes.sm,
    },
    subtitle: {
      fontSize: Sizes.fontMd,
      fontWeight: Fonts.regular.fontWeight,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    form: {
      width: '100%',
    },
    nameRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    nameInput: {
      flex: 1,
      marginHorizontal: Sizes.xs,
    },
    signupButton: {
      marginTop: Sizes.lg,
    },
    loginButton: {
      marginTop: Sizes.md,
    },
    // Add styles for verification screen
    verificationContainer: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: Sizes.lg,
    },
    verificationTitle: {
      fontSize: Sizes.fontTitle,
      fontWeight: Fonts.bold.fontWeight,
      color: Colors.text,
      marginBottom: Sizes.lg,
    },
  }), [Colors, Fonts])

  const navigateToLogin = () => {
    router.replace('/' as never)
  };

  const onSignUpPress = async () => {
    if (!isLoaded) return

    console.log( emailAddress, password)
    if (!emailAddress || !password || !confirmPassword || password != confirmPassword) {
      Alert.alert("Details incorrect!!!")
      return
    }
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerification(true)
    } catch (err) {
      // Alert.alert("Email Address already in use!!!")
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/protected' as never)
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Now handle conditional rendering AFTER all hooks
  if (pendingVerification) {
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.verificationTitle}>Verify your email</Text>
        <Input
            label="Email"
            value={code}
            onChangeText={(code) => setCode(code)}
            placeholder="Enter your verification code"
            autoCapitalize="none"
          />
          <Button
            title="Verify"
            onPress={onVerifyPress}
            style={styles.loginButton}
          />
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>M1</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join M1 and get your AI assistant today
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            value={emailAddress}
            onChangeText={(value) => setEmailAddress(value)}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Input
            label="Password"
            value={password}
            onChangeText={(value) => setPassword(value)}
            placeholder="Create a password"
            secureTextEntry
          />

          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(value) => setConfirmPassword(value)}
            placeholder="Confirm your password"
            secureTextEntry
          />

          <Button
            title="Create Account"
            onPress={onSignUpPress}
            style={styles.signupButton}
          />

          <Button
            title="Already have an account? Sign In"
            onPress={navigateToLogin}
            variant="ghost"
            style={styles.loginButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}