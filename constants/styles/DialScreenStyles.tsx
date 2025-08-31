import { Colors, Fonts, Sizes } from "@/types";
import { StyleSheet } from 'react-native';

export const createDialScreenStyles = ({ colors, fonts, sizes }: 
  { colors: Colors, fonts: Fonts, sizes: Sizes  }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: sizes.lg,
    },
    header: {
      paddingTop: sizes.xxl,
      paddingBottom: sizes.lg,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: sizes.fontXl,
      fontWeight: fonts.weights.semiBold,
      color: colors.text,
      fontFamily: fonts.fontFamily,
    },
    phoneNumberContainer: {
      alignItems: 'center',
      paddingVertical: sizes.lg,
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
      fontSize: sizes.fontXl,
      fontWeight: fonts.weights.regular,
      color: colors.text,
      fontFamily: fonts.fontFamily,
      letterSpacing: 1,
    },
    deleteButton: {
      marginLeft: sizes.md,
      padding: sizes.sm,
      borderRadius: sizes.lg,
      backgroundColor: colors.background,
    },
    dialPadContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    dialPad: {
      justifyContent: 'center',
      paddingVertical: sizes.sm,
    },
    dialRow: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginBottom: sizes.md,
    },
    dialButton: {
      width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    },
    digitText: {
      fontSize: sizes.fontXl,
      fontWeight: fonts.weights.regular,
      color: colors.text,
      fontFamily: fonts.fontFamily,
    },
    lettersText: {
      fontSize: sizes.fontSm,
      fontWeight: fonts.weights.medium,
      color: colors.text,
      marginTop: -2,
      fontFamily: fonts.fontFamily,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      paddingBottom: sizes.lg,
    },
    actionContainer: {
      alignItems: 'center',
      paddingVertical: sizes.lg,
    },
    callButton: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: colors.success,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.shadow,
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
      paddingHorizontal: sizes.lg,
      paddingVertical: sizes.sm,
      borderRadius: sizes.lg,
      minWidth: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default createDialScreenStyles;