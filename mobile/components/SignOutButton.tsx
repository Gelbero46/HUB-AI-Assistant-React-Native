import { useTheme } from '@/context/theme-context'
import { useClerk } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Button } from './Button'
export const SignOutButton = () => {
  const {colors} = useTheme()
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.replace('/')
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <Button
            title="Sign out"
            onPress={handleSignOut}
            // isLoading={isLoading}
            style={{color: colors.textWhite}}
          />
  )
}