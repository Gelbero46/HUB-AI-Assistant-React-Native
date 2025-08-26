import { StyleSheet } from "react-native";
import type { Theme } from "@react-navigation/native";
import { Sizes, Fonts, Colors as colors } from "@/constants";



const ProfileScreenStyle = ({ Colors }: { Colors: Theme['colors'] }) => StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    content: {
      flex: 1,
    },
    profileHeader: {
      alignItems: 'center',
      padding: Sizes.xl,
      backgroundColor: Colors.background,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: Colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Sizes.md,
    },
    avatarText: {
      fontSize: 32,
      fontFamily: Fonts.bold,
      color: Colors.text,
    },
    name: {
      fontSize: Sizes.fontXl,
      fontFamily: Fonts.semiBold,
      color: Colors.text,
      marginBottom: Sizes.xs,
    },
    email: {
      fontSize: Sizes.fontMd,
      fontFamily: Fonts.regular,
      color: Colors.text,
      marginBottom: Sizes.xs,
    },
    business: {
      fontSize: Sizes.fontSm,
      fontFamily: Fonts.medium,
      color: Colors.primary,
    },
    menuSection: {
      backgroundColor: Colors.background,
      marginTop: Sizes.lg,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Sizes.md,
      paddingVertical: Sizes.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    menuIcon: {
      fontSize: 20,
      marginRight: Sizes.md,
    },
    menuTitle: {
      flex: 1,
      fontSize: Sizes.fontMd,
      fontFamily: Fonts.medium,
      color: Colors.text,
    },
    menuChevron: {
      fontSize: 20,
      color: Colors.text,
    },
    logoutSection: {
      padding: Sizes.xl,
    },
    logoutButton: {
      borderColor: colors.error,
    },
});

export default ProfileScreenStyle;