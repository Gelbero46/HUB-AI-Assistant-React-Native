import { useTheme } from '@/context/theme-context';
import { useAuth } from '@clerk/clerk-expo';
import { Stack } from 'expo-router';
export default function AppLayout() {
  // useAuth hook from Clerk SDK
  const { isSignedIn } = useAuth()
  const {theme} = useTheme()

  return (
    <Stack screenOptions={{
            statusBarStyle: theme === "dark" ? "light" : "dark",
            headerShown: false
    }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="callScreen" />
    </Stack>
  )
}