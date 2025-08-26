import { StyleSheet } from 'react-native';
import { Sizes } from '@/constants';

const createStyles = ({ colors, Fonts }: any) =>
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
      padding: Sizes.md,
      paddingBottom: Sizes.xl,
    },
    messageContainer: {
      marginBottom: Sizes.md,
    },
    userMessageContainer: {
      alignItems: 'flex-end',
    },
    aiMessageContainer: {
      alignItems: 'flex-start',
    },
    messageBubble: {
      maxWidth: '80%',
      paddingHorizontal: Sizes.md,
      paddingVertical: Sizes.sm,
      borderRadius: Sizes.radiusLg,
    },
    userMessageBubble: {
      backgroundColor: colors.primary,
      borderBottomRightRadius: Sizes.radiusXs,
    },
    aiMessageBubble: {
      backgroundColor: colors.card,
      borderBottomLeftRadius: Sizes.radiusXs,
    },
    messageText: {
      fontSize: Sizes.fontMd,
      fontFamily: Fonts.regular.fontFamily,
      lineHeight: 20,
    },
    userMessageText: {
      color: colors.textWhite,
    },
    aiMessageText: {
      color: colors.text,
    },
    quickActionsContainer: {
      padding: Sizes.md,
      backgroundColor: colors.backgroundSecondary,
      margin: Sizes.md,
      borderRadius: Sizes.radiusMd,
    },
    quickActionsTitle: {
      fontSize: Sizes.fontSm,
      fontFamily: Fonts.bold.fontFamily,
      color: colors.text,
      marginBottom: Sizes.md,
    },
    quickActionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Sizes.md,
      backgroundColor: colors.background,
      borderRadius: Sizes.radiusSm,
      marginBottom: Sizes.sm,
      gap: Sizes.sm,
    },
    quickActionText: {
      fontSize: Sizes.fontMd,
      fontFamily: Fonts.medium.fontFamily,
      color: colors.text,
    },
    inputContainer: {
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingHorizontal: Sizes.md,
      paddingTop: Sizes.md,
      paddingBottom: Sizes.lg,
    },
    typingIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Sizes.sm,
    },
    typingText: {
      fontSize: Sizes.fontSm,
      fontFamily: Fonts.regular.fontFamily,
      color: colors.textSecondary,
      marginRight: Sizes.sm,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      backgroundColor: colors.backgroundSecondary,
      borderRadius: Sizes.radiusLg,
      paddingHorizontal: Sizes.md,
      paddingVertical: Sizes.sm,
    },
    input: {
      flex: 1,
      fontSize: Sizes.fontMd,
      fontFamily: Fonts.regular.fontFamily,
      color: colors.text,
      maxHeight: 100,
      paddingTop: Sizes.sm,
      paddingBottom: Sizes.sm,
    },
    sendButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: Sizes.sm,
    },
    sendButtonDisabled: {
      backgroundColor: colors.border,
    },
  });

export default createStyles;
