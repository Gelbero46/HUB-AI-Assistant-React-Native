import { useSignIn } from '@clerk/clerk-expo'
// import { useNavigation } from '@react-navigation/native';
import { Button, Input } from '@/components'
// import { Sizes, Colors as colors } from '@/constants'
import { useTheme } from "@/context/theme-context"
import { useColorScheme } from '@/hooks/useColorScheme'
// import { useTheme } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native'


export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const colorScheme = useColorScheme()
  // console.log("colorScheme", colorScheme)

  const router = useRouter()
  const { colors: Colors, fonts: Fonts, sizes: Sizes, theme } = useTheme();

  // console.log("theme", theme)

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isLoading, setIsLoading] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) return

    setIsLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        setIsLoading(false)
       router.replace('/protected/main' as never)
      } else {
        console.error("ooooo",JSON.stringify(signInAttempt, null, 2))
        Alert.alert("User not found")
      }
    } catch (err) {
      Alert.alert("User not found")
      // console.error("tttt", JSON.stringify(err, null, 2))
    }
    setIsLoading(false);
  }

   const navigateToSignup = () => {
    router.replace('/sign-up' as never)
  };

  const styles = React.useMemo( () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Sizes.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Sizes.xxl,
  },
  logo: {
    fontSize: 48,
    fontFamily: Fonts.fontFamily,
    fontWeight: Fonts.weights.semiBold,
    color: Colors.primary,
    marginBottom: Sizes.md,
  },
  title: {
    fontSize: Sizes.fontTitle,
    fontFamily: Fonts.fontFamily,
    fontWeight: Fonts.weights.semiBold,
    color: Colors.text,
    marginBottom: Sizes.sm,
  },
  subtitle: {
    fontSize: Sizes.fontMd,
    fontWeight: Fonts.weights.light,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  loginButton: {
    marginTop: Sizes.lg,
  },
  signupButton: {
    marginTop: Sizes.md,
  },
}), [theme]);

  return (
     <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* <Header title="Login" /> */}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>HUB</Text>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to your M1 AI Assistant account
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            value={emailAddress}
            onChangeText={setEmailAddress}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
          />

          <Button
            title="Sign In"
            onPress={onSignInPress}
            isLoading={isLoading}
            style={styles.loginButton}
          />

          <Button
            title="Don't have an account? Sign Up"
            onPress={navigateToSignup}
            variant="ghost"
            style={styles.signupButton}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}