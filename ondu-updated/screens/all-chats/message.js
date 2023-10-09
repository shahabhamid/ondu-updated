import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

const socket = io("http://192.168.100.7:3001");
import Colors from "../../constants/colors";
import apis from "../../constants/static-ip";
import CustomBubble from "../../components/bubble-custom";
const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;

export default function Message({ navigation, route }) {
  const scrollViewRef = useRef(null);

  const handleNewMessage = () => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  };
  const { data } = route.params;
  const [error, setError] = useState(null);

  const [ourUserData, setOuruserdata] = React.useState(null);
  const [fuserdata, setFuserdata] = React.useState(null);

  const [userid, setUserid] = React.useState(null);
  const [roomid, setRoomid] = React.useState(null);
  const [chat, setChat] = React.useState([""]);
  const [image, setImage] = useState(null);
  const [currentmessage, setCurrentmessage] = React.useState(null);

  // OUR ID & ROOM ID FOR SOCKET.IO
  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }

    if (status === "granted") {
      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });

      if (!response.canceled) {
        //  setProfileImage(response.assets[0]);
        console.log(response.assets[0].uri);
        setCurrentmessage(response.assets[0].uri);
        setImage(response.assets[0].uri);
        //socket.emit("send_message", currentmessage);
      }
    }
  };
  // const handleSend = () => {
  //   const { uri, type, name } = profileImage;

  //   const payload = {
  //     uri,
  //     type,
  //     name,
  //   };

  //   socket.emit("send-image", payload);
  // };
  useEffect(() => {
    loaddata();
  }, []);
  const [scrollEnd, setScrollEnd] = useState(true);
  const [expoPushToken, setExpoPushToken] = useState("");
  // useEffect(() => {
  //   const registerForPushNotifications = async () => {
  //     const { status } = await Notifications.requestPermissionsAsync();
  //     if (status !== "granted") {
  //       alert("You need to grant permission for notifications");
  //       return;
  //     }
  //     const pushToken = await Notifications.getExpoPushTokenAsync();
  //     setExpoPushToken(pushToken);
  //     socket.emit("sendNotification", pushToken);
  //   };
  //   registerForPushNotifications();
  // }, []);

  // useEffect(() => {
  //   Notifications.addNotificationReceivedListener((notification) => {
  //     const { title, body } = notification;
  //     Alert.alert(title, body);
  //   });
  // }, []);
  const handleScroll = () => {
    setScrollEnd(false);
  };

  // useEffect(() => {
  //   if (scrollEnd) {
  //     if (scrollViewRef.current) {
  //       scrollViewRef.current.scrollToEnd({ animated: true });
  //     }
  //   }
  // }, [scrollEnd]);
  useEffect(() => {
    socket.on("receive_message", (data) => {
      // console.log("recieved message - ", data);
      loadMessages(roomid);
    });
  }, [socket]);

  const sortroomid = (id1, id2) => {
    if (id1 > id2) {
      return id1 + id2;
    } else {
      return id2 + id1;
    }
  };
  useEffect(() => {
    socket.emit("sendNotification", {
      recipientUserId: "63dff804a34f81821ac63539",
      title: "Notification Title",
      body: "Notification Body",
    });
  }, []);
  useEffect(() => {
    loadMessages(roomid);
    if (scrollEnd) {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }
  }, [chat]);

  const loaddata = async () => {
    await AsyncStorage.getItem("user")
      .then(async (value) => {
        fetch(apis + "userdata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + JSON.parse(value).token,
          },
          body: JSON.stringify({ email: JSON.parse(value).user.email }),
        })
          .then((res) => res.json())
          .then((dat) => {
            if (dat.message == "User Found") {
              console.log("our user data ", dat.user.username);
              setOuruserdata(dat.user);
              setUserid(dat.user._id);
              console.log(ourUserData);
              fetch(apis + "otheruserdata", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: data.user.email }),
              })
                .then((res) => res.json())
                .then(async (data1) => {
                  if (data1.message == "User Found") {
                    console.log("fuser data ", data1.user.username);
                    setFuserdata(data1.user);
                    let temproomid = await sortroomid(
                      data.user._id,
                      dat.user._id
                    );

                    setRoomid(temproomid);
                    console.log("room id ", temproomid);
                    socket.emit("join_room", { roomid: temproomid });
                    loadMessages(temproomid);
                    //  scrollViewRef.current.scrollToEnd({ animated: true });
                  } else {
                    alert("User Not Found");
                    navigation.navigate("HomePage");
                    // navigation.navigate('Login')
                  }
                })
                .catch((e) => setError(e))
                .catch((err) => {
                  // console.log(err)
                  alert("Something Went Wrong");
                  navigation.navigate("HomePage");
                });
            } else {
              alert("Login Again");
              navigation.navigate("Login");
            }
          })
          .catch((err) => {
            navigation.navigate("Login");
          });
      })
      .catch((err) => {
        navigation.navigate("Login");
      });
  };

  const loadMessages = (temproomid) => {
    fetch(apis + "getmessages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomid: temproomid }),
    })
      .then((res) => res.json())

      .then((data) => {
        setChat(data);
        handleNewMessage;
        // scrollViewRef.current.scrollToEnd({ animated: true });
      })
      .catch((e) => setError(e));
  };
  if (error) {
    return <Text>An error occurred: {error.message}</Text>;
  }

  if (!ourUserData) {
    return (
      <ActivityIndicator
        style={{ flexDirection: "column", alignItems: "center" }}
      />
    );
  }
  if (!fuserdata) {
    return (
      <ActivityIndicator
        style={{ flexDirection: "column", alignItems: "center" }}
      />
    );
  }

  return (
    <>
      <CustomBubble
        bubbleColor={Colors.dark}
        crossColor={Colors.brown}
        navigation={navigation}
      >
        <View style={[styles.container]}>
          <Text
            style={[
              {
                // marginLeft: 44,
                marginTop: 38,
                textAlign: "center",
                fontSize: 28,
                color: Colors.brown,
                fontFamily: "GothicA1-Regular",
              },
            ]}
          >
            {data.user.username}
          </Text>
          <ScrollView
            ref={scrollViewRef}
            onMomentumScrollEnd={handleScroll}
            style={styles.messageView}
          >
            {chat.map((item, index) => {
              return (
                <View style={styles.message} key={index}>
                  {item.senderId == userid && item.type === "text" && (
                    <View style={styles.messageRight}>
                      {ourUserData.profile_pic_name === "" ? (
                        <Ionicons
                          style={{
                            marginVertical: 10,
                          }}
                          name="person-circle-outline"
                          color={Colors.white}
                          size={25}
                        />
                      ) : (
                        <Image
                          style={{
                            marginTop: 10,
                            width: 25,
                            height: 25,
                            borderRadius: 360,
                          }}
                          source={{ uri: ourUserData.profile_pic_name }}
                        />
                      )}
                      <Text style={styles.messageTextRight}>
                        {item.message}
                      </Text>
                    </View>
                  )}
                  {item.senderId != userid &&
                    item.type === "text" &&
                    item != "" && (
                      <View style={styles.messageLeft}>
                        {fuserdata.profile_pic_name === "" ? (
                          <Ionicons
                            style={{
                              marginVertical: 10,
                            }}
                            name="person-circle-outline"
                            color={Colors.white}
                            size={25}
                          />
                        ) : (
                          <Image
                            style={{
                              marginTop: 10,
                              width: 25,
                              height: 25,
                              borderRadius: 360,
                            }}
                            source={{ uri: fuserdata.profile_pic_name }}
                          />
                        )}
                        <Text style={styles.messageTextLeft}>
                          {item.message}
                        </Text>
                      </View>
                    )}

                  {item.senderId == userid && item.type === "image" && (
                    <View style={styles.messageRight}>
                      {ourUserData.profile_pic_name === "" ? (
                        <Ionicons
                          style={{
                            marginVertical: 10,
                          }}
                          name="person-circle-outline"
                          color={Colors.white}
                          size={25}
                        />
                      ) : (
                        <Image
                          style={{
                            marginTop: 10,
                            width: 25,
                            height: 25,
                            borderRadius: 360,
                          }}
                          source={{ uri: ourUserData.profile_pic_name }}
                        />
                      )}
                      <Image
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 18,
                          marginRight: 10,
                          marginBottom: 12,
                        }}
                        source={{ uri: item.message }}
                      />
                    </View>
                  )}
                  {item.senderId != userid &&
                    item.type === "image" &&
                    item != "" && (
                      <View style={styles.messageLeft}>
                        {fuserdata.profile_pic_name === "" ? (
                          <Ionicons
                            style={{
                              marginVertical: 10,
                            }}
                            name="person-circle-outline"
                            color={Colors.white}
                            size={25}
                          />
                        ) : (
                          <Image
                            style={{
                              marginTop: 10,
                              width: 25,
                              height: 25,
                              borderRadius: 360,
                            }}
                            source={{ uri: fuserdata.profile_pic_name }}
                          />
                        )}
                        <Image
                          style={{
                            width: 100,
                            height: 100,
                            borderRadius: 18,
                            marginLeft: 10,
                            marginBottom: 12,
                          }}
                          source={{ uri: item.message }}
                        />
                      </View>
                    )}
                </View>
              );
            })}
          </ScrollView>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <Ionicons
              onPress={handleImageUpload}
              name="add-circle"
              color={Colors.brown}
              size={22}
            />
            <TextInput
              keyboardType="default"
              style={styles.input}
              onChangeText={setCurrentmessage}
              value={currentmessage}
            />

            {currentmessage || image ? (
              <Ionicons
                name="send"
                color={Colors.pink}
                size={22}
                onPress={() => {
                  sendMessage();
                }}
              />
            ) : (
              <Ionicons name="send" color={Colors.white} size={22} />
            )}
          </View>
        </View>
      </CustomBubble>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 25,
    width: size / 2.5,
    fontWeight: "500",
    fontFamily: "GothicA1-Bold",
    backgroundColor: Colors.pink,
    borderRadius: 24,
    textAlign: "center",
    borderColor: Colors.pink,
    marginHorizontal: 10,
    color: Colors.white,
    borderBottomColor: Colors.pink,
    padding: 4,
    borderBottomColor: "#000",

    overflow: "hidden",
  },
  container: {
    alignItems: "center",
    flexDirection: "column",
    marginHorizontal: 45,
  },
  userlists: {
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
  message: {
    width: "100%",
    paddingLeft: 25,
    borderRadius: 10,
    // marginVertical:5,
    // backgroundColor:'red',
  },
  messageView: {
    width: "100%",
    height: "60%",
    marginBottom: 10,
  },
  messageRight: {
    width: "90%",
    alignItems: "flex-start",
    flexDirection: "row-reverse",
    // backgroundColor:'red'
  },
  messageTextRight: {
    color: "white",
    backgroundColor: Colors.pink, // width:'min-content',
    minWidth: 100,
    padding: 2.2,
    fontSize: 15,
    marginLeft: 15,
    textAlign: "center",
    borderRadius: 20,
    margin: 10,
  },
  messageLeft: {
    flexDirection: "row",
    width: "90%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    // backgroundColor:'red'
  },
  messageTextLeft: {
    color: "white",
    backgroundColor: Colors.brown,
    marginRight: 15,
    textAlign: "center",
    borderRadius: 20,
    fontSize: 15,
    minWidth: 100,
    padding: 2.5,
    borderRadius: 20,
    margin: 10,
  },
});
