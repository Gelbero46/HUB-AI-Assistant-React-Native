import { Colors, Fonts, Sizes } from "@/types";
import { StyleSheet } from 'react-native';

const createStyles = ({ colors, fonts, sizes }: 
  { colors: Colors, fonts: Fonts, sizes: Sizes  }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    messagesList: {
      flex: 1,
    },
    messagesContent: {
      padding: sizes.md,
      paddingBottom: sizes.xl,
    },
    messageContainer: {
      marginBottom: sizes.md,
    },
    userMessageContainer: {
      alignItems: 'flex-end',
    },
    aiMessageContainer: {
      alignItems: 'flex-start',
    },
    messageBubble: {
      maxWidth: '80%',
      paddingHorizontal: sizes.md,
      paddingVertical: sizes.sm,
      borderRadius: sizes.radiusLg,
    },
    userMessageBubble: {
      backgroundColor: colors.primary,
      borderBottomRightRadius: sizes.radiusXs,
    },
    aiMessageBubble: {
      backgroundColor: colors.card,
      borderBottomLeftRadius: sizes.radiusXs,
    },
    messageText: {
      fontSize: sizes.fontMd,
      fontWeight: fonts.weights.regular,
      lineHeight: 20,
    },
    userMessageText: {
      color: colors.textWhite,
    },
    aiMessageText: {
      color: colors.text,
    },
    quickActionsContainer: {
      padding: sizes.md,
      backgroundColor: colors.backgroundSecondary,
      margin: sizes.md,
      borderRadius: sizes.radiusMd,
    },
    quickActionsTitle: {
      fontSize: sizes.fontSm,
      fontWeight: fonts.weights.medium,
      color: colors.text,
      marginBottom: sizes.md,
    },
    quickActionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: sizes.md,
      backgroundColor: colors.background,
      borderRadius: sizes.radiusSm,
      marginBottom: sizes.sm,
      gap: sizes.sm,
    },
    quickActionText: {
      fontSize: sizes.fontMd,
      fontWeight: fonts.weights.medium,
      color: colors.textSecondary,
    },
    inputContainer: {
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingHorizontal: sizes.md,
      paddingTop: sizes.md,
      paddingBottom: sizes.lg,
    },
    typingIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: sizes.sm,
    },
    typingText: {
      fontSize: sizes.fontSm,
      fontWeight: fonts.weights.regular,
      color: colors.textSecondary,
      marginRight: sizes.sm,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      backgroundColor: colors.backgroundSecondary,
      borderRadius: sizes.radiusLg,
      paddingHorizontal: sizes.md,
      paddingVertical: sizes.sm,
    },
    input: {
      flex: 1,
      fontSize: sizes.fontMd,
      fontWeight: fonts.weights.regular,
      color: colors.text,
      maxHeight: 100,
      paddingTop: sizes.sm,
      paddingBottom: sizes.sm,
    },
    sendButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: sizes.sm,
    },
    sendButtonDisabled: {
      backgroundColor: colors.border,
    },
  });

export default createStyles;
