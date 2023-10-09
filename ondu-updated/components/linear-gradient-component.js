import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import Colors from "../constants/colors";

export default function LinearGradientComponent({ children }) {
  return (
    <LinearGradient
      colors={[Colors.white, Colors.pink]}
      style={styles.rootScreen}
      start={{ x: 0, y: 0.2 }}
      end={{ x: 0, y: 1.6 }}
    >
      {children}
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
  },
});
