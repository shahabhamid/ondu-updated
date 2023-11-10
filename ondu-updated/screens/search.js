import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../constants/colors";
import UserCard from "../components/userCard";
import apis from "../constants/static-ip";
import CustomBubble from "../components/bubble-custom";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("window");
import { FIREBASE_DATABASE } from "../Firebase/firebaseConfig";
import { get, ref } from "firebase/database";
const size = Math.min(width, height) - 1;

const SearchUserPage = ({ navigation }) => {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const db = FIREBASE_DATABASE;
  const getUsers = async () => {
    setLoading(true);
    try {
      const loggedUser = JSON.parse(await AsyncStorage.getItem("user"));
      // console.log(loggedUser.username, ' loggedUser');
      const usersRef = ref(db, "users");
      const dataSnapshot = await get(usersRef);
      if (dataSnapshot.exists()) {
        const userData = dataSnapshot.val();
        const specificData = {};
        for (const userId in userData) {
          if (userData.hasOwnProperty(userId)) {
            const user = userData[userId];
            specificData[userId] = {
              _id: user._id || "",
              username: user.username || "",
              name: user.name || "",
              profile_pic_name: user.profile_pic_name || "",
              followers: user.followers || "",
              following: user.following || "",
            };
          }
        }
        setData(Object.values(specificData).filter(user => user.username != loggedUser.username));
        // console.log(data, "data")
      }
      else {
        console.log("No data available");
      }
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getUsers();
  }, [keyword]);

  return (
    <CustomBubble
      bubbleColor={Colors.orange}
      crossColor={Colors.pink}
      navigation={navigation}
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Search By Username.."
          onChangeText={(text) => {
            setKeyword(text);
          }}
        />
        {loading ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <>
            {error ? (
              <Text>{error}</Text>
            ) : (
              <ScrollView style={styles.userLists}>
                {data &&
                  data.map((item, index) => {
                    {console.log(item, "item")}
                    return (
                      <UserCard
                        key={item.username}
                        user={item}
                        navigation={navigation}
                      />
                    );
                  })}
              </ScrollView>
            )}
          </>
        )}
      </View>
    </CustomBubble>
  );
};

export default SearchUserPage;

const styles = StyleSheet.create({
  input: {
    height: 35,
    width: size / 1.5,
    fontWeight: "500",
    fontFamily: "GothicA1-Bold",
    backgroundColor: Colors.pink,
    borderRadius: 24,
    textAlign: "center",
    borderColor: Colors.pink,
    color: Colors.white,
    borderBottomColor: Colors.pink,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    borderBottomColor: "#000",
    overflow: "hidden",
  },
  container: {
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginHorizontal: 55,
    paddingVertical: 60,
  },
  userLists: {
    width: "100%",
    marginTop: 20,
  },
});
