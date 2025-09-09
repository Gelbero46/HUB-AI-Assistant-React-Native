import { darkTheme, lightTheme } from "@/constants/theme";
import type { AppTheme, Colors, Fonts, Sizes, ThemeMode } from "@/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

interface ThemeContextType {
  theme: ThemeMode;
  appTheme: AppTheme;
  colors: Colors;
  fonts: Fonts;
  sizes: Sizes;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemTheme = useSystemColorScheme() ?? "light";
  const [theme, setThemeState] = useState<ThemeMode>(systemTheme);

  // Update theme when system theme changes
  useEffect(() => {
    setThemeState(systemTheme);
  }, [systemTheme]);

  const appTheme = theme === "dark" ? darkTheme : lightTheme;
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    appTheme,
    colors: appTheme.colors,
    fonts: appTheme.fonts,
    sizes: appTheme.sizes,
    isDark,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}