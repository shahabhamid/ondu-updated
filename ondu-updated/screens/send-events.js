import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  Image,
  FlatList,
  Pressable,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../constants/colors";
const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;
import CustomBubble from "../components/bubble-custom";
import { FIREBASE_DATABASE } from "../Firebase/firebaseConfig";
import { get, ref, set } from "firebase/database";
import * as Notifications from "expo-notifications";
import axios from "axios";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function SendEvents({ navigation, route }) {
  const [error, setError] = useState(null);
  const [userdataagain, setUserdataagain] = React.useState([]);
  const { data } = route.params;
  // console.log(data, "data");
  const [selectLan, setSelectLan] = useState(0);
  const [key, setKey] = useState([]);
  const [selected, setSelected] = useState([]);
  // const [array, setArray] = useState(null);
  const db = FIREBASE_DATABASE;

  //Notification
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const [token, setToken] = useState("");
  const notificationListener = useRef();
  const responseListener = useRef();

  async function sendPushNotification(recipientExpoPushToken, message) {
    const loggeduser = await AsyncStorage.getItem("user");
    const username = JSON.parse(loggeduser).username;
    const expoPushEndpoint = "https://exp.host/--/api/v2/push/send";
    try {
      const response = await axios.post(expoPushEndpoint, {
        to: recipientExpoPushToken,
        title: username,
        body: message,
      });

      console.log("Notification sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending notification:", error.message);
    }
  }
  
  const handleSelect = (item) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };


  const getLang = async () => {
    setSelectLan(parseInt(await AsyncStorage.getItem("LANG")) || 0);
  };

  const [date, setDate] = useState(new Date("April-20-2000"));

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };
  const [array, setArray] = useState(null);
  const fetchArray = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      const userId = JSON.parse(user)._id;
      // console.log(userId, "user");
      const userRef = ref(db, `users/${userId}`);

      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          // console.log(snapshot.val());
          setArray(snapshot.val());
          // console.log(array, "array");
        } else {
          console.log("No data available");
        }
      });
    } catch (err) {
      setError(err);
      console.log(err);
    }
  };
  const handleSend = async () => {
    const message = "Invited you to " + data.name + " event on " + data.date;
    try {
    for (const user of userdataagain) {
      if (user.token) {
        await sendPushNotification(user.token, message);
      }
    }
    console.log("Push notifications sent to all users.");

    } catch (error) {
      console.error("Error sending push notifications:", error.message);
    }
   };
  useEffect(() => {
    getLang();
    fetchArray();
    fetchData();
  }, [array]);

  const fetchData = async () => {
    try {
      if (array) {
        const followers = array.followers;
        const following = array.following;

        const uniqueKeys = new Set([
          ...Object.keys(following),
          ...Object.keys(followers),
        ]);
        const arr = Array.from(uniqueKeys);
        // console.log(arr, "arr");

        const usersRef = ref(db, "users");
        const dataSnapshot = await get(usersRef);

        if (dataSnapshot.exists()) {
          const userData = dataSnapshot.val();
          const userList = arr.map((userId) => userData[userId]);
          setUserdataagain(userList);
          // console.log(userdataagain, "msgUsers")
        } else {
          console.log("No data available");
        }
      }
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  if (error) {
    return (
      <View
        style={{
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Error: {error.message}
        </Text>
      </View>
    );
  }
  if (!array) {
    return (
      <View
        style={{
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }
  if (!userdataagain) {
    return (
      <View
        style={{
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  function Item({ item, index }) {
    const backg = selected.includes(item) ? Colors.dark : Colors.brown;

    // console.log(item);
    return (
      <View style={[{ marginTop: 10 }, { marginHorizontal: 30 }]}>
        <Pressable
          style={{
            backgroundColor: backg,
            borderRadius: 20,
          }}
          onPress={() => handleSelect(item)}
        >
          <View
            style={{ flex: 1, flexDirection: "row", alignItems: "flex-start" }}
          >
            {item.profile_pic_name != "" ? (
              <Image
                style={{
                  margin: 10,
                  height: 50,
                  width: 50,
                  borderRadius: 360,
                }}
                source={{ uri: item.profile_pic_name }}
              />
            ) : (
              <Ionicons
                name="person-circle-outline"
                size={50}
                color={Colors.white}
              />
            )}
            <View
              style={{
                margin: 10,
                flexDirection: "column",
                alignItems: "flex-start",
                marginLeft: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 20,

                  color: Colors.pink,
                  fontFamily: "GothicA1-Regular",
                }}
              >
                {item.name}
              </Text>
              <Text
                style={{
                  fontSize: 20,

                  color: Colors.pink,
                  fontFamily: "GothicA1-Regular",
                }}
              >
                {item.username}
              </Text>
            </View>
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <CustomBubble
      bubbleColor={Colors.brown}
      crossColor={Colors.pink}
      navigation={navigation}
    >
      <View style={styles.container}>
        <Text
          style={[
            {
              marginTop: 38,
              fontSize: 28,
              color: Colors.white,
              fontFamily: "GothicA1-Regular",
            },
          ]}
        >
          {"Choose\nFriends"}
        </Text>
      </View>
      <View style={styles.container}>
        <FlatList
          style={styles.userlists}
          data={userdataagain}
          keyExtractor={(_, item) => item}
          renderItem={({ item, index }) => {
            return <Item item={item} index={index} />;
          }}
          extraData={selected}
        />

        <Pressable
          style={[styles.dateIn, { height: 25, width: 50, marginTop: 8 }]}
          onPress={() => {
            handleSend();
          }}
        >
          <Text style={styles.fontDesign1}>Send</Text>
        </Pressable>
      </View>
    </CustomBubble>
  );
}

const styles = StyleSheet.create({
  container: {
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginHorizontal: 45,
  },
  userlists: {
    width: "100%",
    marginTop: 10,
    alignContent: "center",
    height: "55%",
  },
  list: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 40,
  },
  secondColumn: {
    marginTop: 45,
  },
  firstcolumn: {
    marginTop: 15,
  },
  bubble: {
    alignItems: "center",
    padding: 10,
  },
  fontDesign1: {
    fontFamily: "GothicA1-Regular",
    color: Colors.white,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    padding: 20,
  },
  datePickerStyle: {
    width: 200,
    marginTop: 20,
  },
  dateIn: {
    margin: 5,
    alignItems: "center",
    backgroundColor: Colors.pink,
    borderRadius: 24,
    borderColor: Colors.pink,
    color: Colors.white,
    borderBottomColor: Colors.pink,
    borderBottomColor: "#000",
    overflow: "hidden",
  },
});
