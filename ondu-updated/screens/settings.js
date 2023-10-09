import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { language } from "../constants/language";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../constants/colors";
import CustomBubble from "../components/bubble-custom";
const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;

export default function Settings({ navigation }) {
  const [selectLan, setSelectLan] = useState(0);

  function nav() {
    navigation.push("LanSelector");
  }
  function nav1() {
    navigation.push("Account");
  }

  const progress = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, { toValue: 1, useNativeDriver: true }).start();
    Animated.timing(scale, { toValue: 1.3, useNativeDriver: true }).start();
    getLang();
  }, []);
  const getLang = async () => {
    setSelectLan(parseInt(await AsyncStorage.getItem("LANG")) || 0);
  };
  return (
    <CustomBubble
      bubbleColor={Colors.orange}
      crossColor={Colors.dark}
      navigation={navigation}
    >
      <View style={selectLan == 1 ? styles.gRoot : styles.root}>
        <Text
          style={[
            styles.fontDesign,
            {
              marginTop: size / 12,
              marginHorizontal: size / 9,
              marginBottom: 12,
              color: Colors.white,
            },
          ]}
        >
          {selectLan == 0 ? language[1].eng : language[1].arab}
        </Text>
        <View style={styles.anRoot}>
          {selectLan == 0 ? <View style={styles.radius} /> : null}
          <Text style={styles.fontDesign} onPress={nav1}>
            {selectLan == 0 ? language[6].eng : language[6].arab}
          </Text>
          {selectLan == 1 ? <View style={styles.radius} /> : null}
        </View>
        <View style={styles.anRoot}>
          {selectLan == 0 ? <View style={styles.radius} /> : null}
          <Text style={styles.fontDesign}>
            {selectLan == 0 ? language[7].eng : language[7].arab}
          </Text>
          {selectLan == 1 ? <View style={styles.radius} /> : null}
        </View>
        <View style={styles.anRoot}>
          {selectLan == 0 ? <View style={styles.radius} /> : null}
          <Text onPress={nav} style={styles.fontDesign}>
            {selectLan == 0 ? language[8].eng : language[8].arab}
          </Text>
          {selectLan == 1 ? <View style={styles.radius} /> : null}
        </View>
        <View style={styles.anRoot}>
          {selectLan == 0 ? <View style={styles.radius} /> : null}
          <Text style={styles.fontDesign}>
            {selectLan == 0 ? language[9].eng : language[9].arab}
          </Text>
          {selectLan == 1 ? <View style={styles.radius} /> : null}
        </View>
        <View style={styles.anRoot}>
          {selectLan == 0 ? <View style={styles.radius} /> : null}
          <Text style={styles.fontDesign}>
            {selectLan == 0 ? language[10].eng : language[10].arab}
          </Text>
          {selectLan == 1 ? <View style={styles.radius} /> : null}
        </View>
        <View style={styles.anRoot}>
          {selectLan == 0 ? <View style={styles.radius} /> : null}
          <Text style={styles.fontDesign}>
            {selectLan == 0 ? language[11].eng : language[11].arab}
          </Text>
          {selectLan == 1 ? <View style={[styles.radius]} /> : null}
        </View>
      </View>
    </CustomBubble>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginHorizontal: size / 4,
    alignItems: "flex-start",
    justifyContent: "space-between",
    alignContent: "center",

    flexDirection: "column",
    marginBottom: size / 10,
  },
  gRoot: {
    flex: 1,
    marginHorizontal: size / 4,
    alignItems: "flex-end",
    justifyContent: "space-between",
    alignContent: "center",

    flexDirection: "column",
    marginBottom: size / 10,
  },
  radius: {
    borderRadius: 360,
    marginHorizontal: 16,
    backgroundColor: Colors.white,
    height: 20,
    width: 20,
    // justifyContent: "center",
    // alignContent: "center",
    // alignItems: "center",
    // flexDirection: "column",
  },
  anRoot: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    alignItems: "center",
  },
  fontDesign: {
    fontFamily: "GothicA1-Medium",
    color: Colors.black,
    fontSize: 24,
  },
});
