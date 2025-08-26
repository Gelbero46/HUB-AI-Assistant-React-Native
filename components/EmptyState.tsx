import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTheme as _useTheme } from '@/context/theme-context';
import { Sizes, Colors as colors } from '@/constants';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  icon?: string;
  actionTitle?: string;
  onActionPress?: () => void;
  style?: any;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  icon,
  actionTitle,
  onActionPress,
  style,
}) => {
  const {colors: Colors, fonts: Fonts} = useTheme();
  const { theme } = _useTheme();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: Sizes.xl,
        },
        icon: {
          fontSize: 64,
          marginBottom: Sizes.lg,
        },
        title: {
          fontSize: Sizes.fontXl,
          fontFamily: Fonts.bold.fontFamily,
          color: Colors.text,
          textAlign: 'center',
          marginBottom: Sizes.sm,
        },
        subtitle: {
          fontSize: Sizes.fontMd,
          fontFamily: Fonts.regular.fontFamily,
          color: `${ theme == 'light'? colors.textSecondary: Colors.text}`,
          textAlign: 'center',
          marginBottom: Sizes.xl,
          lineHeight: 22,
        },
        action: {
          minWidth: 200,
        },
      }),
    [Colors]
  );

  return (
    <View style={[styles.container, style]}>
      {icon && <Text style={styles.icon}>{icon}</Text>}

      <Text style={styles.title}>{title}</Text>

      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      {actionTitle && onActionPress && (
        <Button
          title={actionTitle}
          onPress={onActionPress}
          variant="primary"
          style={styles.action}
        />
      )}
    </View>
  );
};
