import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import Colors from "../constants/colors";
const { width, height } = Dimensions.get("window");

function PrimaryButton({ children, onPress }) {
  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable
        style={({ pressed }) =>
          pressed
            ? [styles.buttonInnerContainer, styles.pressed]
            : styles.buttonInnerContainer
        }
        onPress={onPress}
        android_ripple={{ color: Colors.brown }}
      >
        <Text style={styles.buttonText}>{children}</Text>
      </Pressable>
    </View>
  );
}

export default PrimaryButton;

const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderRadius: 28,
    width: width * 0.6,
    margin: 28,
    marginBottom: 8,

    overflow: "hidden",
  },
  buttonInnerContainer: {
    backgroundColor: Colors.pink,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 2,
  },
  buttonText: {
    color: Colors.white,
    textAlign: "center",
    fontFamily: "GothicA1-SemiBold",
  },
  pressed: {
    opacity: 0.75,
  },
});
