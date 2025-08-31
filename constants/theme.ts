import { AppTheme, Colors, Fonts, Sizes } from '@/types';
import { Platform } from 'react-native';

export const fonts: Fonts = {
  fontFamily: Platform.select({
    ios: 'San Francisco',
    android: 'Roboto',
    default: 'System',
  }),
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
};


export const sizes: Sizes = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  // Font sizes
  fontXs: 12,
  fontSm: 14,
  fontMd: 16,
  fontLg: 18,
  fontXl: 20,
  fontXxl: 24,
  fontTitle: 28,
  fontHeader: 34,
  
  // Icon sizes
  iconXs: 16,
  iconSm: 20,
  iconMd: 24,
  iconLg: 28,
  iconXl: 32,
  
  // Border radius
  radiusXs: 4,
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
  radiusXl: 24,
  radiusRound: 50,
  
};

export const lightColors: Colors = {
  // React Navigation colors
  primary: '#007AFF',
  background: '#FFFFFF',
  card: '#FFFFFF',
  text: '#000000',
  border: '#E5E5EA',
  notification: '#FF3B30',
  
  // Extended colors
  backgroundDark: '#F2F2F7',
  backgroundSecondary: '#F9F9F9',
  surface: '#FFFFFF',
  onSurface: '#000000',
  textWhite: '#FFFFFF',
  textLight: '#8E8E93',
  textSecondary: '#6D6D70',
  secondary: '#5856D6',
  accent: '#FF2D92',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  info: '#5AC8FA',
  primaryVariant: '#0056CC',
  secondaryVariant: '#4240C7',
  disabled: '#C7C7CC',
  placeholder: '#C7C7CC',
  shadow: '#00000029',
  overlay: '#00000080',
  divider: '#E5E5EA',
};

export const darkColors: Colors = {
  // React Navigation colors
  primary: '#0A84FF',
  background: '#0D1117',
  card: '#1C1C1E',
  text: '#FFFFFF',
  border: '#38383A',
  notification: '#FF453A',
  
  // Extended colors
  backgroundDark: '#000000',
  backgroundSecondary: '#2C2C2E',
  surface: '#1C1C1E',
  onSurface: '#FFFFFF',
  textWhite: '#FFFFFF',
  textLight: '#8E8E93',
  textSecondary: '#AEAEB2',
  secondary: '#5E5CE6',
  accent: '#FF375F',
  error: '#FF453A',
  success: '#30D158',
  warning: '#FF9F0A',
  info: '#64D2FF',
  primaryVariant: '#0A66D1',
  secondaryVariant: '#5350D6',
  disabled: '#48484A',
  placeholder: '#48484A',
  shadow: '#00000050',
  overlay: '#000000CC',
  divider: '#38383A',
};

export const lightTheme: AppTheme = {
  colors: lightColors,
  fonts,
  sizes,
};

export const darkTheme: AppTheme = {
  colors: darkColors,
  fonts,
  sizes,
};


// For React Navigation compatibility
export const MyLightTheme = {
  dark: false,
  colors: {
    primary: lightColors.primary,
    background: lightColors.background,
    card: lightColors.card,
    text: lightColors.text,
    border: lightColors.border,
    notification: lightColors.notification,
  },
  fonts: {
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
}
};

export const MyDarkTheme = {
  dark: true,
  colors: {
    primary: darkColors.primary,
    background: darkColors.background,
    card: darkColors.card,
    text: darkColors.text,
    border: darkColors.border,
    notification: darkColors.notification,
  },
   fonts: {
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
}
};