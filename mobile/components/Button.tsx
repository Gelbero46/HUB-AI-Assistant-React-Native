import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ButtonProps } from '../types';
// import { useTheme } from '@react-navigation/native';
import { useTheme } from '@/context/theme-context';
// import {  Colors, Sizes, Fonts } from '../constants';
// import { Sizes, Fonts } from '@/constants';

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  testID,
}) => {

  // const { Colors, toggleTheme } = useTheme();
  const {colors: Colors, fonts: Fonts, sizes: Sizes} = useTheme()

  const styles = React.useMemo( () => StyleSheet.create({
  button: {
    borderRadius: Sizes.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  // Variants
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  // Sizes
  small: {
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.sm,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: Sizes.lg,
    paddingVertical: Sizes.md,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: Sizes.xl,
    paddingVertical: Sizes.lg,
    minHeight: 52,
  },
  // Text styles
  text: {
    fontWeight: Fonts.weights.semiBold,
    textAlign: 'center',
  },
  primaryText: {
    color: Colors.textWhite,
    fontSize: Sizes.fontMd,
  },
  secondaryText: {
    color: Colors.text,
    fontSize: Sizes.fontMd,
  },
  outlineText: {
    color: Colors.primary,
    fontSize: Sizes.fontMd,
  },
  ghostText: {
    color: Colors.primary,
    fontSize: Sizes.fontMd,
  },
  smallText: {
    fontSize: Sizes.fontSm,
  },
  mediumText: {
    fontSize: Sizes.fontMd,
  },
  largeText: {
    fontSize: Sizes.fontLg,
  },
  // States
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: Sizes.sm,
  },
}), [Colors, Fonts, Sizes])
;
  const buttonStyles = [
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
  ];

  

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || isLoading}
      testID={testID}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? Colors.text : Colors.primary}
          />
          <Text style={[textStyles, styles.loadingText]}>Loading...</Text>
        </View>
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

