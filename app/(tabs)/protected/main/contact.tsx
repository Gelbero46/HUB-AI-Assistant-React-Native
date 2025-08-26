import { Image } from 'expo-image';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { Button } from "react-native";
import { useTheme as _useTheme } from "@react-navigation/native";
// import { useTheme } from '../context/theme-context';
import { useTheme } from '@/context/theme-context';


export default function HomeScreen() {
  const { colors } = _useTheme();
  const { theme, toggleTheme } = useTheme()
  return (
    <View style={{marginTop: 50}}>
        <Text style={{color: colors.text}}>contacts here!</Text>
        <Button title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`} onPress={toggleTheme} />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
