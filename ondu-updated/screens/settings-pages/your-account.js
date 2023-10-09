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
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../constants/colors";
import CustomBubble from "../../components/bubble-custom";
import { language } from "../../constants/language";
import ChangePassword from "../../components/change-password";
import ChangeUserName from "../../components/change-username";
import { Alert } from "react-native";
const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;

export default function YourAccount({ navigation }) {
  const [selectLan, setSelectLan] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);

  const logout = () => {
    AsyncStorage.removeItem("user").then(() => {
      Alert.alert("Logged out successfully");
      navigation.navigate("Login");
    });
  };

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
              marginTop: size / 8,
              marginLeft: 20,
              marginBottom: 12,
              color: Colors.white,
            },
          ]}
        >
          {selectLan == 0 ? language[6].eng : language[6].arab}
        </Text>
        <View style={styles.anRoot}>
          {selectLan == 0 ? <View style={styles.radius} /> : null}
          <Text onPress={() => logout()} style={styles.fontDesign}>
            {selectLan == 0 ? language[17].eng : language[17].arab}
          </Text>
          {selectLan == 1 ? <View style={styles.radius} /> : null}
        </View>
        <View style={styles.anRoot}>
          {selectLan == 0 ? <View style={styles.radius} /> : null}
          <Text
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
            style={styles.fontDesign}
          >
            {selectLan == 0 ? language[18].eng : language[18].arab}
          </Text>
          {selectLan == 1 ? <View style={styles.radius} /> : null}
        </View>
        <View style={styles.anRoot}>
          {selectLan == 0 ? <View style={styles.radius} /> : null}
          <Text
            onPress={() => {
              setModalVisible1(!modalVisible);
            }}
            style={styles.fontDesign}
          >
            {selectLan == 0 ? language[19].eng : language[19].arab}
          </Text>
          {selectLan == 1 ? <View style={styles.radius} /> : null}
        </View>
        <ChangePassword
          navigation={navigation}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
        <ChangeUserName
          navigation={navigation}
          modalVisible={modalVisible1}
          setModalVisible={setModalVisible1}
        />
      </View>
    </CustomBubble>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginHorizontal: size / 4,
    alignItems: "flex-start",
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
