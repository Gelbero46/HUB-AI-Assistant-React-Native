import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';

import { MyDarkTheme, MyLightTheme } from "@/constants/theme";
import { ThemeProvider, useTheme } from "@/context/theme-context";
import { ThemeProvider as NavThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

console.log(MyDarkTheme.colors.card)

function RootLayout() {
  const { theme, isDark } = useTheme();

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <NavThemeProvider value={isDark ? MyDarkTheme : MyLightTheme}>
            <Stack
              screenOptions={{
                statusBarStyle: isDark ? "light" : "dark",
                headerStyle: {
                  backgroundColor: isDark ? MyDarkTheme.colors.card : MyLightTheme.colors.card,
                },
                headerTintColor: isDark ? MyDarkTheme.colors.text : MyLightTheme.colors.text,
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style={isDark ? "light" : "dark"} />
          </NavThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider >
      <RootLayout />
    </ThemeProvider>
  );
}