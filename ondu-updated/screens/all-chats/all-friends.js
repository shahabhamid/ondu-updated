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

import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../../constants/colors";
const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;
import axios from "axios";
import { language } from "../../constants/language";
import apis from "../../constants/static-ip";
import CustomBubble from "../../components/bubble-custom";

export default function AllFriends({ navigation }) {
  const [error, setError] = useState(null);
  const [userDataAgain, setUserDataAgain] = React.useState([]);
  // const { data } = route.params;
  const [selectLan, setSelectLan] = useState(0);

  const getLang = async () => {
    setSelectLan(parseInt(await AsyncStorage.getItem("LANG")));
  };
  const [array, setArray] = useState(null);
  const fetchArray = async () => {
    try {

      const loggedUser = JSON.parse(await AsyncStorage.getItem("user"));

      const users = await axios.get(`${apis}/getUsers`)
      setArray(users.data && users.data?.filter(user => user.username != loggedUser.username));

    } catch (err) {
      setError(err);
    }
  };
  // useEffect(() => {
  //   getLang();
  //   fetchArray();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getLang();
        await fetchArray();
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
      }
    };
    fetchData();
  }, []);

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
  if (!userDataAgain) {
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
    return (
      <View
        style={[
          { marginLeft: 30 },
          { marginTop: 30 },
          index % 2 ? styles.secondColumn : styles.firstColumn,
        ]}
      >
        <Pressable
          onPress={() => navigation.navigate("Messages", { data: item })}
        >
          <Image
            style={{
              height: 90,
              width: 90,
              tintColor: index % 2 ? Colors.brown : Colors.orange,
            }}
            source={require("../../assets/chat-bubll.png")}
          />
          {item.profile_pic_name === "" ? (
            <Ionicons
              style={{
                marginTop: 10,
                textAlign: "center",

                left: 14,
                overflow: "hidden",
                right: 14,
                position: "absolute",
              }}
              name={"person-circle-outline"}
              color={Colors.white}
              size={28}
            />
          ) : (
            <Image
              style={{
                marginTop: 10,
                overflow: "hidden",

                left: 30,
                right: 30,
                position: "absolute",
                width: "30%",
                height: "30%",
                borderRadius: 360,
              }}
              source={{ uri: item.profile_pic_name }}
            />
          )}
          <Text
            style={[
              {
                marginTop: 30,
                color: Colors.black,
                textAlign: "center",
                fontFamily: "GothicA1-Medium",
                left: 14,
                top: 11,
                overflow: "hidden",
                right: 14,
                fontSize: 12,
                position: "absolute",
              },
            ]}
          >
            @{item.username}
          </Text>
        </Pressable>
      </View>
    );
  }
  return (
    <CustomBubble
      bubbleColor={Colors.dark}
      crossColor={Colors.brown}
      navigation={navigation}
    >
      <View style={styles.container}>
        <Text
          style={[
            {
              // marginLeft: 44,
              marginTop: 38,
              fontSize: 28,
              color: Colors.white,
              fontFamily: "GothicA1-Regular",
            },
          ]}
        >
          {selectLan == 0 ? language[0].eng : language[0].arab}
        </Text>
      </View>
      <View style={styles.container}>
        <FlatList
          style={styles.userLists}
          // data={userDataAgain}
          data={array}
          numColumns={2}
          keyExtractor={(_, item) => item}
          renderItem={({ item, index }) => {
            return <Item item={item} index={index} />;
          }}
        />
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
  userLists: {
    width: "100%",
    marginTop: 20,
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
  firstColumn: {
    marginTop: 15,
  },
  bubble: {
    alignItems: "center",
    padding: 10,
  },
});
