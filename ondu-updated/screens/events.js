import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Colors from "../constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import { language } from "../constants/language";
import CustomBubble from "../components/bubble-custom";
import { FIREBASE_DATABASE } from "../Firebase/firebaseConfig";
import { get, ref, set } from "firebase/database";

const { width, height } = Dimensions.get("window");
const numColumns = width > 600 ? 3 : 2;
export default function Events() {
  const [selectLan, setSelectLan] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const [eventList, setEventList] = React.useState([]);
  const [eventKeys, setEventKeys] = React.useState([]);
  const [load, setIsLoad] = useState(false);
  const navigation = useNavigation();
  const db = FIREBASE_DATABASE;

  useEffect(() => {
    getLang();
  }, []);

  const getLang = async () => {
    setSelectLan(parseInt(await AsyncStorage.getItem("LANG")) || 0);
  };

  const getEvents = async () => {
    setIsLoad(true);
    try {
      // const data = await axios.get(`${apis}/events`)
      const eventRef= ref(db, 'events');
      const snapshot = await get(eventRef);
      // const data= snapshot.ref();
      const data= snapshot.val();
      // console.log(Object.keys(data), "data");

      setEventList(Object.values(data));
      setEventKeys(Object.keys(data));
    } catch (error) {
      Alert.error(error.message)
    }
    setIsLoad(false)
  };

  useEffect(() => {
    getEvents();
  }, []);

  useEffect(() => {
    Animated.timing(progress, { toValue: 1, useNativeDriver: true }).start();
    Animated.timing(scale, { toValue: 1.3, useNativeDriver: true }).start();
  }, []);
  return (
    <CustomBubble
      bubbleColor={Colors.dark}
      crossColor={Colors.brown}
      navigation={navigation}
    >
      <View style={styles.root}>
        <Text style={styles.fontDesign}>
          {selectLan == 0 ? language[4].eng : language[4].arab}
        </Text>
        <View style={styles.container}>
          <FlatList
            style={{ margin: 20 }}
            data={eventList}
            keyExtractor={(_, item) => item}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => navigation.push("EventDetails", { item: item })}
              >
                <View style={styles.anRoot}>
                  <View
                    style={
                      index % 2 == 0
                        ? styles.sm_bubble
                        : [styles.sm_bubble, { backgroundColor: "#423242" }]
                    }
                  >
                    <View
                      style={{
                        flexDirection: "column",
                        alignItems: "center",
                        alignContent: "center",
                      }}
                    >
                      {item.pic === "" ? (
                        <Ionicons
                          name="person-circle"
                          size={35}
                          color={Colors.white}
                          style={{
                            marginHorizontal: 5,
                            alignItems: "center",
                            alignContent: "center",
                            justifyContent: "center",
                          }}
                        />
                      ) : (
                        <Image
                          style={{
                            height: 25,
                            width: 25,
                            borderRadius: 360,
                            marginBottom: 4,
                          }}
                          source={{ uri: item.pic }}
                        />
                      )}
                      <Text style={styles.fontDes}>{item.name}</Text>
                      <Text style={styles.fontDes}>{item.username}</Text>
                      <Text style={styles.fontDes}>{item.date}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            numColumns={numColumns}
            ListFooterComponent={() => (
              <View style={{ height: 100 }}>
                {load && <ActivityIndicator size="large" color={Colors.dark} />}
              </View>
            )}
          />
        </View>
      </View>
    </CustomBubble>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  anRoot: {
    padding: 12,
  },
  sm_bubble: {
    width: 105,
    height: 105,
    borderRadius: 360,
    backgroundColor: Colors.pink,
    alignItems: "center",
    padding: 4,
    flex: 1,
  },
  root: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },

  fontDesign: {
    fontFamily: "GothicA1-Regular",
    alignItems: "center",
    color: Colors.white,
    fontSize: 24,
  },
  fontDes: {
    fontFamily: "GothicA1-Regular",
    textAlign: "center",
    padding: 0.2,
    marginHorizontal: 5,
    color: Colors.white,
    fontSize: 9,
  },
});
