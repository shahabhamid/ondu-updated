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

const socket = io("http://192.168.0.105:3001");
import Colors from "../../constants/colors";
import apis from "../../constants/static-ip";
import CustomBubble from "../../components/bubble-custom";
import { FIREBASE_DATABASE } from "../../Firebase/firebaseConfig";
import { get, ref, set, query, orderByChild, equalTo, onValue } from "firebase/database";
const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;

export default function Message({ navigation, route }) {
  const scrollViewRef = useRef(null);
  const db = FIREBASE_DATABASE;

  const handleNewMessage = () => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  };
  const { data } = route.params;
  // console.log("data", data._id);
  const [error, setError] = useState(null);

  const [ourUserData, setOurUserData] = useState([]);
  const [fuserdata, setFuserData] = useState([]);

  const [userid, setUserid] = useState(null);
  const [roomId, setRoomid] = useState(null);
  const [chat, setChat] = useState(null);
  const [image, setImage] = useState(null);
  const [currentmessage, setCurrentmessage] = useState("");

  const loadmessage = async () => {
    try {
      const messagesRef = ref(db, "messages");
      const roomMessagesQuery = query(
        messagesRef,
        orderByChild("roomid"),
        equalTo(roomId)
      );
  
      console.log(roomId, "roomid")
      onValue(roomMessagesQuery, (snapshot) => {
        const messages = snapshot.val();
        if (messages){
          const roomMessagesArray = Object.values(messages);
          const sortedMessages = roomMessagesArray.sort((a, b) => {
            return a.createdAt - b.createdAt;
          });

          setChat(sortedMessages);
          if (sortedMessages.length > 0) {
            handleNewMessage();
          }
        }

        // if (snapshot.exists()) {
        //   const roomMessagesArray = Object.values(snapshot.val());
          
        //   // Order messages by timestamp
        //   const sortedMessages = roomMessagesArray.sort((a, b) => {
        //     return a.createdAt - b.createdAt;
        //   });
    
        //   setChat(sortedMessages);
        //   if (sortedMessages.length > 0) {
        //     handleNewMessage();
        //   }

        //   // handleNewMessage();
        // } 
        else {
          console.log("No messages with roomid found");
        }
      });
    } catch (error) {
      console.error("Error in loadmessage:", error);
    }
  };
  
  const userRoom = async () => {
    try {
      const loggedUser = JSON.parse(await AsyncStorage.getItem("user"));
      const loggedUserid = loggedUser._id;
      setUserid(loggedUserid);
      const msgUser = data._id;

      let roomid = "";
      if (loggedUserid > msgUser) {
        roomid = loggedUserid + msgUser;
      } else {
        roomid = msgUser + loggedUserid;
      }
      setRoomid(roomid);
      // console.log(roomid, "roomid");
      loadmessage();
    } catch (error) {
      console.error("Error in userRoom:", error);
    }
  };

  const sendMessage = async () => {
    try {
      console.log(image, "image");
      const loggedUser = JSON.parse(await AsyncStorage.getItem("user"));
      const loggedUserid = loggedUser._id;
      const msgUser = data._id;
      let type,
        mimeType,
        fileName = "";
      if (image) {
        type = "image";
        mimeType = "image/png";
        fileName = Date.now().toFixed(10) + "image.png";
      } else {
        type = "text";
        mimeType = "";
        fileName = "";
      }

      const message = {
        senderid: loggedUserid,
        message: currentmessage,
        roomid: roomId,
        recieverid: msgUser,
        type: type,
        mimeType: mimeType,
        fileName: fileName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // const ObjectId = loggedUserid + Date.now();
      const ObjectId = Date.now();
      const msgRef = ref(db, `messages/${ObjectId}`);
      await set(msgRef, message);
      loadmessage();
      setCurrentmessage("");
      setImage("");
    } catch (error) {
      console.error("Error in sendMessage:", error);
    }
  };

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
        // console.log(response.assets[0].uri);
        setCurrentmessage(response.assets[0].uri);
        setImage(response.assets[0].uri);
        //socket.emit("send_message", currentmessage);
      }
    }
  };

  useEffect(() => {
    // loaddata();
    userRoom();
  }, []);
  const [scrollEnd, setScrollEnd] = useState(true);

  const handleScroll = () => {
    setScrollEnd(false);
  };

  useEffect(() => {
    // Load messages when roomId changes
    if (roomId) {
      loadmessage();
    }
  }, [roomId]);

  useEffect(() => {
    // Check for initial load
    if (chat === null) {
      return; // Initial load, skip further processing
    }

    // Handle new messages
    if (scrollEnd && chat) {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }
  }, [chat, scrollEnd]);

  // useEffect(() => {
  //   loadmessage();
  //   if (scrollEnd) {
  //     if (scrollViewRef.current) {
  //       scrollViewRef.current.scrollToEnd({ animated: true });
  //     }
  //   }
  // }, [chat]);

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
            {data.username}
          </Text>
          <ScrollView
            ref={scrollViewRef}
            onMomentumScrollEnd={handleScroll}
            style={styles.messageView}
          >
            {chat != null && chat.map((item, index) => {
              return (
                <View style={styles.message} key={index}>
                  {/* {console.log("item", userid )} */}
                  {item.senderid == userid && item.type === "text" && (
                    <View style={styles.messageLeft}>
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
                      <Text style={styles.messageTextLeft}>{item.message}</Text>
                    </View>
                  )}
                  {item.senderid != userid &&
                    item.type === "text" &&
                    item != "" && (
                      <View style={styles.messageRight}>
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
                        <Text style={styles.messageTextRight}>
                          {item.message}
                        </Text>
                      </View>
                    )}

                  {item.senderid == userid && item.type === "image" && (
                    <View style={styles.messageLeft}>
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
                  {item.senderid != userid &&
                    item.type === "image" &&
                    item != "" && (
                      <View style={styles.messageRight}>
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
