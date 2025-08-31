import { useTheme } from '@/context/theme-context';
import { Moon, Sun } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface ThemeToggleButtonProps {
  size?: number;
  style?: any;
}

export function ThemeToggleButton({ size = 24, style }: ThemeToggleButtonProps) {
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[styles.button, { backgroundColor: colors.surface }, style]}
      activeOpacity={0.7}
    >
      {isDark ? (
        <Sun 
          size={size} 
          color={colors.text} 
        />
      ) : (
        <Moon 
          size={size} 
          color={colors.text} 
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
});