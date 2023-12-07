import React, { useEffect, useRef, useState } from "react";
import {
  Switch,
  Animated,
  Button,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import Colors from "../constants/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import CustomBubble from "../components/bubble-custom";
import axios from "axios";
import { FIREBASE_DATABASE } from "../Firebase/firebaseConfig";
import { get, set, push, ref } from "firebase/database";
import * as Notifications from "expo-notifications";

const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function EventDetails({ navigation, route }) {
  const { item } = route.params;
  //   console.log(item, "item");
  const [selectLan, setSelectLan] = useState(0);
  const [user, setUser] = useState();
  const [follow, setFollow] = useState(false);
  const [unFollow, setUnFollow] = useState(false);
  const [loading, setLoading] = useState(true);

  const db = FIREBASE_DATABASE;

  //Notification
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const [token, setToken] = useState("");
  const notificationListener = useRef();
  const responseListener = useRef();

  // useEffect(() => {
  //     console.log(data.token, "data.token");
  //     setExpoPushToken(data.token);
  //     notificationListener.current =
  //       Notifications.addNotificationReceivedListener((notification) => {
  //         setNotification(notification);
  //         console.log(notification, "notification");
  //       });

  //     responseListener.current =
  //       Notifications.addNotificationResponseReceivedListener((response) => {
  //         console.log(response, "response");
  //       });

  //     return () => {
  //       Notifications.removeNotificationSubscription(
  //         notificationListener.current
  //       );
  //       Notifications.removeNotificationSubscription(responseListener.current);
  //     };
  //   }, []);

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

  useEffect(() => {
    fetchData();
    getTokens();
  }, []);

  const getTokens = async () => {
    const userId = item.userId;
    console.log(userId, "userId");
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);
    const data = snapshot.val();
    setToken(data.token);
    // console.log(data.token, data.username);
  };

  const fetchData = async () => {
    try {
      await Promise.all([getData(), getFollowers(), getUnFollowers()]);
      setLoading(false);
    } catch (error) {
      console.error("An error occurred during data fetching:", error);
    }
  };

  const getFollowers = async () => {
    const loggeduser = await AsyncStorage.getItem("user");
    const loggeduserobj = JSON.parse(loggeduser).username;
    const eventRef = ref(db, `events/${item.eventId}/followers`);
    const snapshot = await get(eventRef);
    const data = snapshot.val();
    let isFollowing = false;

    if (data) {
      Object.values(data).forEach((follower) => {
        if (follower.username === loggeduserobj) {
          isFollowing = true;
        }
      });
      setFollow(isFollowing);
    }
  };

  const getUnFollowers = async () => {
    const loggeduser = await AsyncStorage.getItem("user");
    const loggeduserobj = JSON.parse(loggeduser).username;
    const eventRef = ref(db, `events/${item.eventId}/Unfollow`);
    const snapshot = await get(eventRef);
    const data = snapshot.val();
    let isFollowing = false;
    if (data) {
      Object.values(data).forEach((follower) => {
        if (follower.username === loggeduserobj) {
          isFollowing = true;
        }
      });
      setUnFollow(isFollowing);
    }
  };

  const getData = async () => {
    setSelectLan(parseInt(await AsyncStorage.getItem("LANG")) || 0);
    setUser(JSON.parse(await AsyncStorage.getItem("user")));
  };

  const FollowThisUser = async () => {
    const loggeduser = await AsyncStorage.getItem("user");

    const eventId = item.eventId;
    const followRef = ref(db, `events/${eventId}/followers`);
    const newRef = push(followRef);
    const data = {
      username: JSON.parse(loggeduser).username,
    };
    set(newRef, data);

    const recipientExpoPushToken = token;
    console.log(recipientExpoPushToken, "recipientExpoPushToken");
    const currentmessage =
      "Accepted your event named " + item.name + " on " + item.date;
    await sendPushNotification(recipientExpoPushToken, currentmessage);

    getFollowers();
  };

  const UnfollowThisUser = async () => {
    const loggeduser = await AsyncStorage.getItem("user");

    const eventId = item.eventId;
    const followRef = ref(db, `events/${eventId}/Unfollow`);
    const newRef = push(followRef);
    const data = {
      username: JSON.parse(loggeduser).username,
    };
    set(newRef, data);

    const recipientExpoPushToken = token;
    console.log(recipientExpoPushToken, "recipientExpoPushToken");
    const currentmessage =
      "Rejected your event named " + item.name + " on " + item.date;
    await sendPushNotification(recipientExpoPushToken, currentmessage);

    getUnFollowers();
  };
  return (
    <CustomBubble
      bubbleColor={Colors.dark}
      crossColor={Colors.brown}
      navigation={navigation}
    >
      {loading && <ActivityIndicator size="large" color={Colors.white} />}
      {!loading && (
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 25,
              height: hp("20%"),
            }}
          >
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              {user.profile_pic_name === "" ? (
                <Ionicons name="person-circle" size={60} color={Colors.white} />
              ) : (
                <Image
                  style={{
                    height: 50,
                    width: 50,
                    marginRight: 8,
                    borderRadius: 360,
                  }}
                  source={{ uri: item.pic }}
                />
              )}
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "flex-start",
                //justifyContent: "center",
                paddingRight: hp("7%"),
              }}
            >
              <Text style={{ color: Colors.brown, fontSize: 20 }}>
                {item.uname}
              </Text>
              <Text style={{ color: Colors.brown, fontSize: 20 }}>
                {"@" + item.username}
              </Text>
            </View>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{ color: Colors.white, fontSize: 20, paddingBottom: 10 }}
            >
              {item.name}
            </Text>
            <Text style={{ color: Colors.pink, fontSize: 20 }}>
              {item.date}
            </Text>
            <Text
              style={{
                padding: 8,
                color: Colors.white,
                fontSize: 16,
                justifyContent: "center",
              }}
            >
              {item.desc}
            </Text>

            {follow && (
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: Colors.pink, fontSize: 20 }}>
                  You followed this event
                </Text>
              </View>
            )}

            {unFollow && (
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: Colors.pink, fontSize: 20 }}>
                  You unfollowed this event
                </Text>
              </View>
            )}

            {!follow && !unFollow && (
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {user?.username == item.username ? (
                  <View>
                    <Text style={{ color: Colors.white, fontSize: 20 }}>
                      You created this event
                    </Text>
                  </View>
                ) : (
                  <Pressable>
                    <View
                      style={{
                        alignItems: "center",
                        backgroundColor: Colors.brown,
                        height: 30,
                        width: 60,
                        borderRadius: 20,
                      }}
                    >
                      <Ionicons
                        name={"ios-checkmark"}
                        size={22}
                        color={Colors.white}
                        onPress={() => FollowThisUser()}
                      />
                    </View>
                  </Pressable>
                )}
                <View style={{ width: 10 }}></View>
                {user?.username === item.username ? (
                  <View></View>
                ) : (
                  <Pressable>
                    <View
                      style={{
                        alignItems: "center",
                        backgroundColor: Colors.pink,
                        height: 30,
                        width: 60,
                        borderRadius: 20,
                      }}
                    >
                      <Ionicons
                        name={"ios-close-outline"}
                        size={22}
                        color={Colors.white}
                        onPress={() => UnfollowThisUser()}
                      />
                    </View>
                  </Pressable>
                )}

                {/* {follow && <Text>You followed this event</Text>} */}
              </View>
            )}
          </View>
        </>
      )}
    </CustomBubble>
  );
}
export default EventDetails;

const styles = StyleSheet.create({});
