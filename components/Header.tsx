import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderProps } from '../types';
// import { Colors, Sizes, Fonts } from '../constants';
import { Sizes, Fonts } from '@/constants';
import { useTheme } from '@react-navigation/native';

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  rightAction,
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();

  const {colors: Colors} = useTheme()

  const styles = React.useMemo( () => StyleSheet.create({
    container: {
      backgroundColor: Colors.background,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Sizes.md,
      paddingVertical: Sizes.md,
      minHeight: 44,
    },
    title: {
      flex: 1,
      fontSize: Sizes.fontLg,
      fontFamily: Fonts.semiBold,
      color: Colors.text,
      textAlign: 'center',
    },
    backButton: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backButtonText: {
      fontSize: Sizes.fontXl,
      color: Colors.primary,
    },
    rightAction: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rightActionText: {
      fontSize: Sizes.fontLg,
      color: Colors.primary,
    },
  }), [Colors, Sizes, Fonts] );
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.content}>
          {showBackButton ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBackPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.backButton} />
          )}

          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>

          {rightAction ? (
            <TouchableOpacity
              style={styles.rightAction}
              onPress={rightAction.onPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.rightActionText}>{rightAction.icon}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.rightAction} />
          )}
        </View>
      </View>
    </>
  );
};

