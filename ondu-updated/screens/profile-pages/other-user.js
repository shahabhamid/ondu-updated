import React, { useEffect, useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Colors from "../../constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apis from "../../constants/static-ip";
import axios from "axios";
import { FIREBASE_DATABASE } from "../../Firebase/firebaseConfig";
import { set, get, ref, remove } from "firebase/database";

const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;

export default function OtherUser({ navigation, route }) {
  const [userData, setUserData] = React.useState(null);
  const { user } = route.params;
  const [isFollowing, setFollowing] = React.useState(false);
  const db = FIREBASE_DATABASE;

  const loadData = async () => {
    try {
      const loggedUserObj = JSON.parse(await AsyncStorage.getItem("user"));

      const usersRef = ref(db, "users");
      const dataSnapshot = await get(usersRef);
      const specificData = {};
      if (dataSnapshot.exists()) {
        const userData = dataSnapshot.val();
        for (const userId in userData) {
          if (userData.hasOwnProperty(userId)) {
            const users = userData[userId];
            if (users.username === user.username) {
              specificData[userId] = {
                _id: users._id || "",
                username: users.username || "",
                name: users.name || "",
                profile_pic_name: users.profile_pic_name || "",
                followers: users.followers || "",
                following: users.following || "",
              };
            }
          }
        }
      } else {
        console.log("No data available");
      }
      const data = Object.values(specificData)
      setUserData(data);

      const followersData = data[0].followers;
      for (const key in followersData) {
        if (followersData.hasOwnProperty(key)) {
          const element = followersData[key];
          if (element.username === loggedUserObj.username) {
            setFollowing(true);
          }
        }
      }
    } catch (error) {
      Alert.alert("Something Went Wrong");
      navigation.navigate("search");
    }
  };

  const FollowThisUser = async () => {
    try {
      const loggedUserObj = JSON.parse(await AsyncStorage.getItem("user"));
      const followFromId= loggedUserObj._id;
      const followFrom= {username:loggedUserObj.username};
      const followToId= userData[0]._id;
      const followTo= {username: userData[0].username};

      const followingRef = ref(db, `users/${followFromId}` + "/following/" + followToId);
      await set(followingRef, followTo);

      const followersRef = ref(db, `users/${followToId}` + "/followers/" + followFromId);
      await set(followersRef, followFrom);

      setFollowing(true);
      Alert.alert("User Followed");
    } catch (error) {
      Alert.alert("Something went wrong");
    }
  };

  const UnFollowThisUser = async () => {
    try {
      const loggedUserObj = JSON.parse(await AsyncStorage.getItem("user"));
      const followFromId= loggedUserObj._id;
      const followToId= userData[0]._id;

      const followingRef = ref(db, `users/${followFromId}` + "/following/" + followToId);
      remove(followingRef);

      const followersRef = ref(db, `users/${followToId}` + "/followers/" + followFromId);
      remove(followersRef);

      setFollowing(false);
      Alert.alert("User UnFollowed");
    } catch (error) {
      Alert.alert("Something went wrong");
    }
  };

  const progress = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progress, { toValue: 1, useNativeDriver: true }).start();
    Animated.timing(scale, { toValue: 1.3, useNativeDriver: true }).start();
    loadData();
  }, []);
  return userData ? (
    <View style={styles.root}>
      <Animated.View
        style={[
          styles.itemRadius,
          styles.styleBubble,
          {
            backgroundColor: Colors.dark,
            right: size / 3,
            bottom: size / 22.2 - 100,
          },
          { opacity: progress, transform: [{ scale }] },
        ]}
      >
        <Text
          style={{
            color: Colors.white,
            fontSize: 28,
            textAlign: "center",
            marginRight: 30,
            marginTop: 20,
          }}
        >
          Events
        </Text>
        <ScrollView style={{ marginTop: size / 25, marginBottom: size / 8 }}>
          {userData.allEvents &&
            userData.allEvents.map((event, index) => (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  flexDirection: "row",
                  marginLeft: size / 3.5,
                }}
                key={index}
              >
                <View
                  style={{
                    height: 10,
                    width: 10,
                    borderRadius: 360,
                    backgroundColor: Colors.pink,
                  }}
                ></View>
                <Text
                  style={{
                    color: Colors.brown,
                    fontSize: 28,
                    textAlign: "left",
                    padding: 5,
                  }}
                >
                  {event.name}
                </Text>
              </View>
            ))}
        </ScrollView>
      </Animated.View>
      <Animated.View
        style={[
          styles.icon,
          styles.itemRadiuses,
          styles.styleCrossBubble,
          { backgroundColor: Colors.brown },
          { opacity: progress, transform: [{ scale }] },
        ]}
      >
        <Ionicons
          name={"ios-close-outline"}
          color={Colors.white}
          size={44}
          onPress={() => {
            setUserData(null);
            navigation.push("search", { disabledAnimation: true });
          }}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.itemRadius,
          styles.styleBubble,
          {
            backgroundColor: Colors.pink,
            left: size / 3,
            top: size / 2.2,
            height: size / 2 + 100,
            width: size / 2 + 100,
          },

          { opacity: progress, transform: [{ scale }] },
        ]}
      >
        <View style={styles.userDetail}>
          <Text
            numberOfLines={1}
            style={[styles.fonts, { color: Colors.brown }]}
          >
            @{userData[0].username}
          </Text>
          <Text
            numberOfLines={2}
            style={[styles.fonts, { color: Colors.white }]}
          >
            {userData.bio === "" ? "" : userData.bio}
          </Text>
          <Text
            numberOfLines={3}
            style={[styles.fonts, { color: Colors.brown }]}
          >
            {userData.links === "" ? "" : userData.links}
          </Text>
        </View>
        <Animated.View
          style={[
            styles.innerCircle,
            styles.icon,
            styles.styleCrossBubble,
            { backgroundColor: Colors.orange },
            { opacity: progress, transform: [{ scale }] },
          ]}
        >
          {userData.profile_pic_name === "" ? (
            <Ionicons name={"image-outline"} color={Colors.white} size={40} />
          ) : (
            <Image
              style={{ width: "100%", height: "100%", borderRadius: 360 }}
              source={{ uri: userData.profile_pic_name }}
            />
          )}
        </Animated.View>
        <Animated.View
          style={[
            styles.icon,
            styles.smallCircle,
            {
              backgroundColor: Colors.orange,
              right: size / 1.5 - 5,
              top: size / 8.7,
            },
            { opacity: progress, transform: [{ scale }] },
          ]}
        >
          {isFollowing ? (
            <Ionicons
              onPress={() => UnFollowThisUser()}
              name={"ios-close-outline"}
              color={Colors.white}
              size={24}
            />
          ) : (
            <Ionicons
              onPress={() => FollowThisUser()}
              name={"ios-checkmark"}
              color={Colors.white}
              size={24}
            />
          )}
        </Animated.View>
      </Animated.View>
    </View>
  ) : (
    <ActivityIndicator />
  );
}

const styles = StyleSheet.create({
  userDetail: {
    flexDirection: "column",
    marginHorizontal: size / 4,
    marginTop: size / 5,
  },
  fonts: {
    fontSize: 24,
    fontFamily: "GothicA1-Medium",
  },
  smallCircle: {
    height: size / 8,
    width: size / 8,
    borderRadius: 360,
    position: "absolute",
    zIndex: -1,
  },
  innerCircle: {
    borderRadius: 360,
    position: "absolute",
    zIndex: -1,
    left: size / 4.1,
    height: size / 2 + 130,
    width: size / 2 + 130,
    bottom: size / 1.5,
  },
  root: {
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
    height: size / 2 + 130,
    width: size / 2 + 130,
    position: "absolute",
    zIndex: -1,
  },
  styleCrossBubble: {
    height: size / 4,
    width: size / 4,
  },
  itemRadiuses: {
    borderRadius: 360,
    position: "absolute",
    zIndex: -1,
    left: size / 16,
    top: size / 9,
  },
  profilePic: {
    alignItems: "center",
    alignContent: "center",
    width: 150,
    height: 150,
    borderRadius: 75,
    margin: 10,
  },
});
