import React from "react";
import { Tabs } from "expo-router";
import { View, Platform } from "react-native";
import {
  Inbox,
  Bot,
  Search,
  CheckSquare,
  User,
  Sparkles,
  Grip,
} from "lucide-react-native";

import { Colors as colors } from "@/constants";
import { useTheme } from "@react-navigation/native";
import { useTheme as _useTheme } from "@/context/theme-context";

export default function TabsLayout() {
  const { colors: Colors } = useTheme();
  const { theme } = _useTheme();

  const getTabIcon = (routeName: string, focused: boolean, size: number) => {
    const iconColor = focused ? Colors.primary : colors.textSecondary;
    const iconSize = focused ? size + 2 : size;

    const iconComponents = {
      inbox: <Inbox size={iconSize} color={iconColor} strokeWidth={focused ? 2.5 : 2} />,
      aiassistant: <Bot size={iconSize} color={iconColor} strokeWidth={focused ? 2.5 : 2} />,
      dial: <Grip size={iconSize} color={iconColor} strokeWidth={focused ? 2.5 : 2} />,
      contact: <CheckSquare size={iconSize} color={iconColor} strokeWidth={focused ? 2.5 : 2} />,
      profile: <User size={iconSize} color={iconColor} strokeWidth={focused ? 2.5 : 2} />,
    };

    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: 28,
          height: 28,
          borderRadius: focused ? 14 : 0,
          backgroundColor: focused ? `${theme == 'light' ? colors.backgroundSecondary : 'transparent' }` : "transparent",
          marginBottom: focused ? 2 : 0,
        }}
      >
        {iconComponents[routeName as keyof typeof iconComponents]}
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, size }) => getTabIcon(route.name, focused, size),
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
          borderTopWidth: 0.5,
          paddingBottom: Platform.OS === "ios" ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === "ios" ? 85 : 65,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
          fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tabs.Screen name="inbox" options={{ title: "Inbox" }} />
      <Tabs.Screen
        name="aiassistant"
        options={{
          title: "Assistant",
          tabBarIcon: ({ focused, size }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: focused ? Colors.primary : 'transparent',
              }}
            >
              <Sparkles
                size={focused ? size + 2 : size}
                color={focused ? Colors.text : Colors.primary}
                strokeWidth={2.5}
                fill={focused ? Colors.text : "none"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen name="dial" options={{ title: "Dial" }} />
      <Tabs.Screen name="contact" options={{ title: "Contact" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
