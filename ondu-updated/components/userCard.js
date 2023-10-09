import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../constants/colors";

const UserCard = ({ user, navigation }) => {

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.push("Other_UserProfile", { user: user });
      }}
    >
      <View style={styles.ChatCard}>
        {user.profile_pic_name === "" ? (
          <Ionicons name={"person-outline"} color={Colors.white} size={25} margin={3} />
        ) : (
          <Image source={{ uri: user.profile_pic_name }} style={styles.image} />
        )}
        <View style={styles.c1}>
          <Text style={styles.username}>{user.username}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  ChatCard: {
    backgroundColor: Colors.pink,
    width: "100%",
    marginTop: 6,
    borderRadius: 20,
    padding: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: "25%",
    height: 25,
    margin: 3,
    borderRadius: 360,
  },
  username: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  c1: {
    marginLeft: 20,
    flexDirection: "row",
    alignItems: "center",
    alignContent: "space-between",
  },
  lastMessage: {
    color: "gray",
    fontSize: 19,
  },
});
