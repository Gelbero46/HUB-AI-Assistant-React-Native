import { useAuth } from '@clerk/clerk-expo'
import { Stack } from 'expo-router'
import { useTheme } from '@/context/theme-context'

export default function AppLayout() {
  // useAuth hook from Clerk SDK
  const { isSignedIn } = useAuth()
  const {theme} = useTheme()
  console.log("isSignedIn", isSignedIn)

  return (
    <Stack screenOptions={{ headerShown: false,  statusBarStyle: theme === "dark" ? "light" : "dark",}}>
      {/* Public routes */}
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="index" />
        <Stack.Screen name="sign-up" />
      </Stack.Protected>

      {/* Protected routes */}
      <Stack.Protected guard={isSignedIn!}>
        <Stack.Screen name="protected" />
      </Stack.Protected>
    </Stack>
  )
}