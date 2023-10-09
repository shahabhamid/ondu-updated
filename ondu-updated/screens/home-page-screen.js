import React, {
  useEffect,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Colors from "../constants/colors";
import Bubble from "../components/bubble";
import { language } from "../constants/language";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");
function HomePage() {
  const [selectLan, setSelectLan] = useState(0);
  const [leftBubbleAnim, setLeftBubbleAnim] = useState(new Animated.Value(0));
  const [rightBubbleAnim, setRightBubbleAnim] = useState(new Animated.Value(0));
  const navigation = useNavigation();

  useEffect(() => {
    getLang();
  }, []);

  const getLang = async () => {
    setSelectLan(parseInt(await AsyncStorage.getItem("LANG")) || 0);
  };

  useEffect(() => {
    Animated.timing(leftBubbleAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    Animated.timing(rightBubbleAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const getWidth = (x) => { return Number(Math.floor(width / 100 * x)) }
  return (
    <View style={{ flex: 1, height: height }}>
      <Bubble
        style={{
          left: leftBubbleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-width, 0],
          }),
        }}
        onPress={() =>
          navigation.navigate(
            "allFriends",
            { disabledAnimation: true }
          )
        }
        bubbleStyle={{
          top: hp("10%"),
          position: "absolute",
          zIndex: 1,
          left: -10,
        }}
        styleBubble={{
          backgroundColor: Colors.dark,
          height: getWidth(55),
          width: getWidth(55),
        }}
        iconName={"md-chatbubble-ellipses-outline"}
        textMessage={selectLan == 0 ? language[0].eng : language[0].arab}
        iconSize={48}
        iconColor={Colors.pink}
        textStyle={styles.text}
      />
      <Bubble
        style={{
          left: leftBubbleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-width, 0],
          }),
        }}
        onPress={() => navigation.push("Settings", { disabledAnimation: true })}
        styleBubble={{
          backgroundColor: Colors.orange,
          height: getWidth(40),
          width: getWidth(40),
        }}
        bubbleStyle={{
          top: hp("8%"),
          position: "absolute",
          zIndex: 1,
          right: 15,
        }}
        iconName={"md-settings-outline"}
        textMessage={selectLan == 0 ? language[1].eng : language[1].arab}
        iconSize={42}
        iconColor={Colors.dark}
        textStyle={styles.textOne}
      />
      <Bubble
        style={{
          left: leftBubbleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-width, 0],
          }),
        }}
        onPress={() =>
          navigation.push("CreateEvent", { disabledAnimation: true })
        }
        bubbleStyle={{
          top: hp("35%"),
          position: "absolute",
          zIndex: 1,
          right: -30,
        }}
        styleBubble={{
          backgroundColor: Colors.brown,
          height: getWidth(57),
          width: getWidth(57),
        }}
        iconName={"add-sharp"}
        textMessage={selectLan == 0 ? language[2].eng : language[2].arab}
        iconSize={48}
        iconColor={Colors.dark}
        textStyle={styles.textTwo}
      />
      <Bubble
        style={{
          left: leftBubbleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-width, 0],
          }),
        }}
        onPress={() =>
          navigation.navigate("ProfileScreen", { disabledAnimation: true })
        }
        bubbleStyle={{
          top: hp("45%"),
          position: "absolute",
          zIndex: 1,
          left: -30,
        }}
        styleBubble={{
          backgroundColor: Colors.pink,
          height: getWidth(62),
          width: getWidth(62),
        }}
        iconName={"person-outline"}
        textMessage={selectLan == 0 ? language[3].eng : language[3].arab}
        iconSize={48}
        iconColor={Colors.brown}
        textStyle={styles.textTwo}
      />
      <Bubble
        style={{
          left: leftBubbleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-width, 0],
          }),
        }}
        onPress={() => navigation.push("Events", { disabledAnimation: true })}
        bubbleStyle={{
          top: hp("70%"),
          position: "absolute",
          zIndex: 1,
          right: 2,
        }}
        styleBubble={{
          backgroundColor: Colors.dark,
          height: getWidth(53),
          width: getWidth(53),
        }}
        iconName={"calendar-outline"}
        textMessage={selectLan == 0 ? language[4].eng : language[4].arab}
        iconSize={40}
        iconColor={Colors.orange}
        textStyle={styles.text}
      />
      <Bubble
        style={{
          left: leftBubbleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-width, 0],
          }),
        }}
        onPress={() => navigation.push("search", { disabledAnimation: true })}
        bubbleStyle={{
          top: hp("78%"),
          position: "absolute",
          zIndex: 1,
          left: 25,
        }}
        styleBubble={{
          backgroundColor: Colors.orange,
          height: getWidth(32),
          width: getWidth(32),
        }}
        iconName={"search-outline"}
        textMessage={selectLan == 0 ? language[5].eng : language[5].arab}
        iconSize={40}
        iconColor={Colors.dark}
        textStyle={styles.text}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginTop: 20,
  },
  text: {
    fontFamily: "GothicA1-Regular",
    color: Colors.white,
    fontSize: 24,
    paddingTop: 8,
  },
  textOne: {
    fontFamily: "GothicA1-Regular",
    color: Colors.white,
    fontSize: 20,
    paddingTop: 4,
  },
  textTwo: {
    fontFamily: "GothicA1-Regular",
    color: Colors.white,
    fontSize: 32,
    paddingTop: 4,
    textAlign: "center",
  },
  ball: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "tomato",
    position: "absolute",
    left: 160,
  },
  button: {
    width: 150,
    height: 70,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fc5c65",
    marginVertical: 50,
  },
  secondContainer: {
    padding: 10,
  },
  firstContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  secondContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  thirdContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
});
export default HomePage;
