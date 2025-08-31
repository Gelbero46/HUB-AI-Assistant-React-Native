import { Button, StyleSheet, View } from 'react-native';
// import { useTheme as _useTheme } from "@react-navigation/native";
// import { useTheme } from '../context/theme-context';
import { useTheme } from '@/context/theme-context';


export default function ToggleThemeButton() {
  // const { colors } = _useTheme();
  const { colors, theme, toggleTheme } = useTheme()
  return (
    <View style={{margin: 20}}>
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
