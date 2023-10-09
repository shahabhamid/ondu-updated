import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Colors from "../../constants/colors";
import LanModal from "../../components/lan-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { language } from "../../constants/language";
import CustomBubble from "../../components/bubble-custom";
const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;
export default function LanSelector({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectLan, setSelectLan] = useState(0);

  const saveSelLan = async (index) => {
    await AsyncStorage.setItem("LANG", index + "");
  };

  const progress = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, { toValue: 1, useNativeDriver: true }).start();
    Animated.timing(scale, { toValue: 1.3, useNativeDriver: true }).start();
  }, []);
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
              marginTop: size / 10,
              marginLeft: selectLan == 0 ? size / 6 : 0,
              marginRight: selectLan == 1 ? size / 6 : 0,
              alignContent: "center",
              marginBottom: 12,
              color: Colors.white,
            },
          ]}
        >
          {selectLan == 0 ? language[8].eng : language[8].arab}
        </Text>
        <View style={styles.anRoot}>
          {selectLan == 0 ? <View style={styles.radius} /> : null}
          <Text
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
            style={styles.fontDesign}
          >
            {selectLan == 0 ? language[13].eng : language[13].arab}
          </Text>
          {selectLan == 1 ? <View style={styles.radius} /> : null}
        </View>

        <LanModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          onSelectLan={(x) => {
            setSelectLan(x);
            saveSelLan(x);
          }}
        />
      </View>
    </CustomBubble>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginHorizontal: size / 8,
    alignItems: "flex-start",
    alignContent: "center",
    flexDirection: "column",
    marginBottom: size / 10,
  },
  gRoot: {
    flex: 1,
    marginHorizontal: size / 8,
    alignItems: "flex-end",
    alignContent: "center",

    flexDirection: "column",
    marginBottom: size / 10,
  },
  radius: {
    borderRadius: 360,
    marginHorizontal: 16,
    backgroundColor: Colors.white,
    height: 20,
    width: 20
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
