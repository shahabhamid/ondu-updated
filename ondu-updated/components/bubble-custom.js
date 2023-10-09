import { useEffect, useRef } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import Colors from "../constants/colors";

const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;

export default function CustomBubble({
  bubbleColor,
  crossColor,
  navigation,
  children,
}) {
  const progress = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, { toValue: 1, useNativeDriver: true }).start();
    Animated.timing(scale, { toValue: 1.3, useNativeDriver: true }).start();
  }, []);
  return (
    <View style={styles.root}>
      <Animated.View
        style={[
          styles.itemRadius,
          styles.styleBubble,
          { backgroundColor: bubbleColor },

          { opacity: progress, transform: [{ scale }] },
        ]}
      >
        <Animated.View
          style={[
            styles.icon,
            styles.itemRadiuses,
            styles.styleCrossBubble,
            { backgroundColor: crossColor },
            { opacity: progress, transform: [{ scale }] },
          ]}
        >
          <Ionicons
            name={"ios-close-outline"}
            color={Colors.white}
            size={44}
            onPress={() =>
              navigation.push("HomePage", { disabledAnimation: true })
            }
          />
        </Animated.View>
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginTop: size / 7,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  itemRadius: {
    borderRadius: 360,
  },
  styleBubble: {
    height: size,
    width: size,
  },
  styleCrossBubble: {
    height: size / 5,
    width: size / 5,
  },
  itemRadiuses: {
    borderRadius: 360,
    position: "absolute",
    zIndex: -1,
    left: size / 6,
    bottom: size / 1.1,
  },
});
