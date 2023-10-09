import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../constants/colors";
import { useState } from "react";

export default function Bubble({
  styleBubble,
  onPress,
  bubbleStyle,
  iconName,
  iconColor,
  iconSize,
  textStyle,
  textMessage,
}) {
  const [position] = useState(new Animated.Value(0));

  const progress = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  // useEffect(() => {
  //   Animated.timing(progress, { toValue: 1, useNativeDriver: true }).start();
  //   Animated.timing(scale, { toValue: 1, useNativeDriver: true }).start();
  // }, []);
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(position, {
          toValue: 10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(position, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  return (
    <View style={bubbleStyle}>
      <Pressable onPress={onPress}>
        <Animated.View
          style={[
            styles.itemLoc,
            styles.item,
            styleBubble,
            {
              transform: [{ translateY: position }],
              opacity: position.interpolate({
                inputRange: [0, 10],
                outputRange: [1, 5],
              }),
            },
          ]}
        >
          <Ionicons name={iconName} color={iconColor} size={iconSize} />
          <Text style={textStyle}>{textMessage}</Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  item: {
    borderRadius: 360,
  },
  itemLoc: {
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
});
