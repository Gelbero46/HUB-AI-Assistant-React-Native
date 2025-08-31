import { useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
// import { useTheme } from "@react-navigation/native";
import { SignOutButton } from "@/components/SignOutButton";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import ProfileScreenStyle from "@/constants/styles/ProfileScreenStyle";
import { useTheme } from "@/context/theme-context";
import { useUser } from "@clerk/clerk-expo";

// Lucide icons
import {
  Bell,
  Building,
  ChevronRight,
  HelpCircle,
  Info,
  Phone,
  Shield,
} from "lucide-react-native";

export default function ProfileScreen() {
  const { colors: Colors, fonts: Fonts, sizes: Sizes, theme } = useTheme();
  // const { theme, toggleTheme } = _useTheme();
  const { user } = useUser();
  // console.log(user)
  const styles = useMemo( () => 
    ProfileScreenStyle({ Colors, Fonts, Sizes }),
  [theme]);

  const menuItems = [
    { id: "1", title: "Business Setup", icon: Building, onPress: () => console.log("Business Setup") },
    { id: "2", title: "Phone Settings", icon: Phone, onPress: () => console.log("Phone Settings") },
    { id: "3", title: "Notifications", icon: Bell, onPress: () => console.log("Notifications") },
    { id: "4", title: "Privacy & Security", icon: Shield, onPress: () => console.log("Privacy") },
    { id: "5", title: "Help & Support", icon: HelpCircle, onPress: () => console.log("Help") },
    { id: "6", title: "About", icon: Info, onPress: () => console.log("About") },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.firstName?.charAt(0) || "U"}
            </Text>
          </View>

          <Text style={styles.name}>
            {user?.firstName} {user?.lastName}
          </Text>

          <Text style={styles.email}>
            {user?.emailAddresses[0].emailAddress}
          </Text>

          {user?.unsafeMetadata?.businessName as string && (
            <Text style={styles.business}>{user?.unsafeMetadata?.businessName as string}</Text>
          )}

          <ThemeToggleButton 
          style={{ position: 'absolute', top: 50, right: 20 }} 
        />
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <Icon size={20} color={Colors.text} style={{ marginRight: 10 }} />
                <Text style={styles.menuTitle}>{item.title}</Text>
                <ChevronRight size={18} color={Colors.text} style={{ marginLeft: "auto" }} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <SignOutButton />
        </View>
      </ScrollView>
    </View>
  );
}
