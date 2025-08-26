// @/constants/styles/DialScreenStyles.ts
import { StyleSheet, Platform } from 'react-native';
import { Sizes,Colors } from '@/constants';
import type { Theme } from "@react-navigation/native";

export const createDialScreenStyles = ({ colors, fonts }: {colors: Theme['colors'], fonts: Theme['fonts'] }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: Sizes.lg,
    },
    header: {
      paddingTop: Platform.OS === 'ios' ? Sizes.xxl : Sizes.xxl,
      paddingBottom: Sizes.lg,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: Sizes.fontXl,
      fontWeight: fonts.bold.fontWeight as any,
      color: colors.text,
      fontFamily: fonts.bold.fontFamily,
    },
    phoneNumberContainer: {
      alignItems: 'center',
      paddingVertical: Sizes.lg,
      flexDirection: 'row',
      justifyContent: 'center',
      minHeight: 60,
    },
    phoneNumberScrollView: {
      flex: 1,
    },
    phoneNumberScrollContent: {
      flexGrow: 1,
      justifyContent: 'flex-end',
    },
    phoneNumberText: {
      textAlign: 'center',
      fontSize: Sizes.fontXl,
      fontWeight: fonts.regular.fontWeight as any,
      color: colors.text,
      fontFamily: fonts.regular.fontFamily,
      letterSpacing: 1,
    },
    deleteButton: {
      marginLeft: Sizes.md,
      padding: Sizes.sm,
      borderRadius: Sizes.lg,
      backgroundColor: colors.background,
    },
    dialPadContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    dialPad: {
      justifyContent: 'center',
      paddingVertical: Sizes.sm,
    },
    dialRow: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginBottom: Sizes.md,
    },
    dialButton: {
      width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    },
    digitText: {
      fontSize: Sizes.fontXl,
      fontWeight: fonts.regular.fontWeight as any,
      color: colors.text,
      fontFamily: fonts.regular.fontFamily,
    },
    lettersText: {
      fontSize: Sizes.fontSm,
      fontWeight: fonts.medium.fontWeight as any,
      color: colors.text,
      marginTop: -2,
      fontFamily: fonts.medium.fontFamily,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      paddingBottom: Sizes.lg,
    },
    actionContainer: {
      alignItems: 'center',
      paddingVertical: Sizes.lg,
    },
    callButton: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: Colors.success,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
    },
    callButtonDisabled: {
      backgroundColor: colors.text,
      shadowOpacity: 0.1,
    },
    quickActionButton: {
      paddingHorizontal: Sizes.lg,
      paddingVertical: Sizes.sm,
      borderRadius: Sizes.lg,
      minWidth: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default createDialScreenStyles;