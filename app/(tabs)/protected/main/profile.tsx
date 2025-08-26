import { Image } from "expo-image";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useTheme as _useTheme } from "@/context/theme-context";
import { useUser } from "@clerk/clerk-expo";
import { SignOutButton } from "@/components/SignOutButton";
import ProfileScreenStyle from "@/constants/styles/ProfileScreenStyle";

// Lucide icons
import {
  Building,
  Phone,
  Bell,
  Shield,
  HelpCircle,
  Info,
  ChevronRight,
} from "lucide-react-native";

export default function ProfileScreen() {
  const { colors: Colors } = useTheme();
  const { theme, toggleTheme } = _useTheme();
  const { user } = useUser();
  const styles = ProfileScreenStyle({ Colors });

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

          {user?.businessName && (
            <Text style={styles.business}>{user.businessName}</Text>
          )}
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
