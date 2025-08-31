import { Colors, Fonts, Sizes } from "@/types";
import { StyleSheet } from "react-native";


const ProfileScreenStyle = ({ Colors, Fonts, Sizes }: { 
  Colors: Colors
  Fonts: Fonts
  Sizes: Sizes
}) => StyleSheet.create({
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
      fontWeight: Fonts.weights.bold,
      color: Colors.text,
    },
    name: {
      fontSize: Sizes.fontXl,
      fontWeight: Fonts.weights.medium,
      color: Colors.text,
      marginBottom: Sizes.xs,
    },
    email: {
      fontSize: Sizes.fontMd,
      fontWeight: Fonts.weights.regular,
      color: Colors.text,
      marginBottom: Sizes.xs,
    },
    business: {
      fontSize: Sizes.fontSm,
      fontWeight: Fonts.weights.semiBold,
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
      borderBottomColor: Colors.border,
    },
    menuIcon: {
      fontSize: 20,
      marginRight: Sizes.md,
    },
    menuTitle: {
      flex: 1,
      fontSize: Sizes.fontMd,
      fontWeight: Fonts.weights.light,
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
      borderColor: Colors.error,
    },
});

export default ProfileScreenStyle;