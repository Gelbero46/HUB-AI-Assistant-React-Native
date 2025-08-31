import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { InputProps } from '../types';
// import { Colors, Sizes, Fonts } from '../constants';
// import { Sizes, Fonts } from '@/constants';
import { useTheme } from '@/context/theme-context';
// import { useTheme } from '@react-navigation/native';

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  style,
  testID,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureVisible, setIsSecureVisible] = useState(false);

   const {colors: Colors, fonts: Fonts, sizes: Sizes, theme} = useTheme()

  const styles = React.useMemo( () => StyleSheet.create({
    container: {
      marginBottom: Sizes.md,
    },
    label: {
      fontSize: Sizes.fontSm,
      fontFamily: Fonts.fontFamily,
      color: Colors.text,
      marginBottom: Sizes.xs,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: Sizes.radiusMd,
      backgroundColor: Colors.background,
    },
    inputContainerFocused: {
      borderColor: Colors.primary,
    },
    inputContainerError: {
      borderColor: Colors.error,
    },
    input: {
      flex: 1,
      paddingHorizontal: Sizes.md,
      paddingVertical: Sizes.md,
      fontSize: Sizes.fontMd,
      fontFamily: Fonts.regular,
      color: Colors.text,
    },
    eyeButton: {
      padding: Sizes.md,
    },
    eyeText: {
      fontSize: Sizes.fontLg,
    },
    errorText: {
      fontSize: Sizes.fontSm,
      fontWeight: Fonts.weights.regular,
      color: Colors.error,
      marginTop: Sizes.xs,
    }
  }), [theme] );

  const inputContainerStyles = [
    styles.inputContainer,
    isFocused && styles.inputContainerFocused,
    error && styles.inputContainerError,
  ];


  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={inputContainerStyles}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isSecureVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          testID={testID}
          placeholderTextColor={Colors.textSecondary}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setIsSecureVisible(!isSecureVisible)}
          >
            <Text style={styles.eyeText}>
              {isSecureVisible ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

