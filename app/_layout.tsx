import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';

import { MyDarkTheme, MyLightTheme } from "@/constants/theme";
import { ThemeProvider, useTheme } from "@/context/theme-context";
import { ThemeProvider as NavThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

function RootLayout() {
  const { theme } = useTheme(); // will now come from top-level provider
  console.log("themerrrrr", theme);

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <NavThemeProvider value={theme === "dark" ? MyDarkTheme : MyLightTheme}>
            <Stack
              screenOptions={{
                statusBarStyle: theme === "dark" ? "light" : "dark",
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style={theme === "dark" ? "light" : "dark"} />
          </NavThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <RootLayout />
    </ThemeProvider>
  );
}
