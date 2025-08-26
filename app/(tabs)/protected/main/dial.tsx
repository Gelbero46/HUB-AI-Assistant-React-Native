import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Vibration,
  ScrollView,
  Alert,
} from 'react-native';
import { Phone, Delete, Plus, MessageSquare } from 'lucide-react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';

import { RootStackParamList } from '@/types';
import createDialScreenStyles from '@/constants/styles/DialScreenStyles';

// Types
interface DialButtonData {
  digit: string;
  letters: string;
}

interface DialButtonProps {
  digit: string;
  letters?: string;
  onPress: (digit: string) => void;
}

// type DialScreenNavigationProp = StackNavigationProp<RootStackParamList>;

// Constants
const DIAL_PAD_DATA: DialButtonData[][] = [
  [
    { digit: '1', letters: '' },
    { digit: '2', letters: 'ABC' },
    { digit: '3', letters: 'DEF' },
  ],
  [
    { digit: '4', letters: 'GHI' },
    { digit: '5', letters: 'JKL' },
    { digit: '6', letters: 'MNO' },
  ],
  [
    { digit: '7', letters: 'PQRS' },
    { digit: '8', letters: 'TUV' },
    { digit: '9', letters: 'WXYZ' },
  ],
  [
    { digit: '*', letters: '' },
    { digit: '0', letters: '+' },
    { digit: '#', letters: '' },
  ],
];

// Utility functions
const formatPhoneNumber = (number: string): string => {
  const cleaned = number.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  
  if (match) {
    const formatted = [match[1], match[2], match[3]]
      .filter(group => group.length > 0)
      .join('-');
    return formatted;
  }
  return number;
};

const triggerHapticFeedback = (): void => {
  try {
    if (Platform.OS === 'ios') {
      // iOS supports different types of haptic feedback
      const { impactAsync, ImpactFeedbackStyle } = require('expo-haptics');
      if (impactAsync && ImpactFeedbackStyle) {
        impactAsync(ImpactFeedbackStyle.Light);
      } else {
        // Fallback for older versions
        Vibration.vibrate(10);
      }
    } else {
      // Android vibration
      Vibration.vibrate(50);
    }
  } catch (error) {
    // Fallback if haptics are not available
    console.warn('Haptic feedback not available:', error);
  }
};

// Components
const DialButton: React.FC<DialButtonProps> = React.memo(({ digit, letters, onPress }) => {
  const { colors, fonts } = useTheme();
  const styles = useMemo(() => createDialScreenStyles({ colors, fonts}), [colors, fonts]);

  const handlePress = useCallback(() => {
    triggerHapticFeedback();
    onPress(digit);
  }, [digit, onPress]);

  return (
    <TouchableOpacity
      style={styles.dialButton}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityLabel={`Dial ${digit}${letters ? ` ${letters}` : ''}`}
      accessibilityRole="button"
    >
      <Text style={styles.digitText}>{digit}</Text>
      {letters && <Text style={styles.lettersText}>{letters}</Text>}
    </TouchableOpacity>
  );
});

DialButton.displayName = 'DialButton';

// Main Component
export const DialScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const navigation = useNavigation();
  const { colors, fonts } = useTheme();
  
  const styles = useMemo(() => createDialScreenStyles({ colors, fonts }), [colors, fonts]);

  const handleDigitPress = useCallback((digit: string): void => {
    setPhoneNumber(prev => prev + digit);
  }, []);

  const handleDeletePress = useCallback((): void => {
    triggerHapticFeedback();
    setPhoneNumber(prev => prev.slice(0, -1));
  }, []);

  const handleCallPress = useCallback((): void => {
    if (phoneNumber.length === 0) {
      Alert.alert('No Number', 'Please enter a phone number to call.');
      return;
    }
    
    triggerHapticFeedback();
    navigation.navigate('callScreen', { phoneNumber });
  }, [phoneNumber, navigation]);

  const handleMessagePress = useCallback((): void => {
    if (phoneNumber.length === 0) return;
    
    triggerHapticFeedback();
    Alert.alert('Message', `Send message to ${phoneNumber}?`);
    // TODO: Implement message functionality
  }, [phoneNumber]);

  const handleAddContactPress = useCallback((): void => {
    if (phoneNumber.length === 0) return;
    
    triggerHapticFeedback();
    Alert.alert('Add Contact', `Add ${phoneNumber} to contacts?`);
    // TODO: Implement add contact functionality
  }, [phoneNumber]);

  const formattedPhoneNumber = useMemo(() => {
    return phoneNumber.length > 0 ? formatPhoneNumber(phoneNumber) : '';
  }, [phoneNumber]);

  const hasPhoneNumber = phoneNumber.length > 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Keypad</Text>
      </View>

      {/* Phone Number Display */}
      <View style={styles.phoneNumberContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.phoneNumberScrollContent}
          style={styles.phoneNumberScrollView}
        >
          <Text style={styles.phoneNumberText} numberOfLines={1}>
            {formattedPhoneNumber}
          </Text>
        </ScrollView>
        
        {hasPhoneNumber && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeletePress}
            activeOpacity={0.7}
            accessibilityLabel="Delete last digit"
            accessibilityRole="button"
          >
            <Delete size={20} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>

      {/* Dial Pad */}
      <View style={styles.dialPadContainer}>
        <View style={styles.dialPad}>
          {DIAL_PAD_DATA.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.dialRow}>
              {row.map((item) => (
                <DialButton
                  key={item.digit}
                  digit={item.digit}
                  letters={item.letters}
                  onPress={handleDigitPress}
                />
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Actions Container */}
      <View style={styles.actionsContainer}>
        {/* Message Button */}
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={handleMessagePress}
          activeOpacity={0.7}
          disabled={!hasPhoneNumber}
          accessibilityLabel="Send message"
          accessibilityRole="button"
        >
          {hasPhoneNumber && (
            <MessageSquare size={20} color={colors.primary} />
          )}
        </TouchableOpacity>
        
        {/* Call Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.callButton,
              !hasPhoneNumber && styles.callButtonDisabled
            ]}
            onPress={handleCallPress}
            activeOpacity={0.8}
            disabled={!hasPhoneNumber}
            accessibilityLabel={`Call ${phoneNumber}`}
            accessibilityRole="button"
          >
            <Phone size={28} color="#C7C7CC" />
          </TouchableOpacity>
        </View>

        {/* Add Contact Button */}
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={handleAddContactPress}
          activeOpacity={0.7}
          disabled={!hasPhoneNumber}
          accessibilityLabel="Add to contacts"
          accessibilityRole="button"
        >
          {hasPhoneNumber && (
            <Plus size={20} color={colors.primary} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DialScreen;