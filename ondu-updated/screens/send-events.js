import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Pressable,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const socket = io("http://192.168.100.7:3002");
import Colors from "../constants/colors";
const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;
import apis from "../constants/static-ip";
import CustomBubble from "../components/bubble-custom";

export default function SendEvents({ navigation, route }) {
  const [error, setError] = useState(null);
  const [userdataagain, setUserdataagain] = React.useState([]);
  const { data } = route.params;
  const [selectLan, setSelectLan] = useState(0);
  const [selected, setSelected] = useState([]);
  // const handleSend = () => {
  //   socket.on("send-data", selected);
  //   console.log(selected);
  // };
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

  useEffect(() => {
    // const socket = io("http://192.168.100.7:3002");
  }, []);
  const [array, setArray] = useState(null);
  const fetchArray = async () => {
    try {
      await AsyncStorage.getItem("user")
        .then(async (value) => {
          fetch(apis + `/${JSON.parse(value).username}`)
            .then((res) => res.json())
            .then((dat) => {
              setArray(dat);
              console.log("data", dat);
            });
        })
        .catch((err) => {
          setError(err);
        });
    } catch (err) {
      setError(err);
      console.log(err);
    }
  };
  const handleSend = async () => {
    console.log("sss", selected);
    const response = await fetch(apis + "send-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selected: selected,
        mess: data,
      }),
    });
    if (response.ok) {
      const dat = await response.json();
      console.log(dat);
      navigation.navigate("HomePage");
    }

    // console.log(response.data);
  };
  useEffect(() => {
    console.log(data);
    getLang();

    fetchArray();
  }, []);
  useEffect(() => {
    if (array) {
      let allData = array.following.concat(array.followers);

      let uniqueData = allData.filter(
        (value, index, self) => self.indexOf(value) === index
      );

      console.log(uniqueData);

      uniqueData.forEach((item) => {
        console.log(item);
        const fetchData2 = async () => {
          try {
            const res = await fetch(apis + `otheruserdata`, {
              method: "POST",

              body: JSON.stringify({ email: item }),

              headers: {
                "Content-Type": "application/json",
              },
            });
            const data = await res.json();
            console.log(data);

            setUserdataagain((prevData2) => [...prevData2, data]);
          } catch (err) {
            console.error(err);
            setError(err);
          }
        };
        fetchData2();
      });
    }
  }, [array]);
  // useEffect(() => {
  //   if (array) {
  //     array.followers.forEach((item) => {
  //       console.log(item);
  //       const fetchData2 = async () => {
  //         try {
  //           const res = await fetch(apis + `otheruserdata`, {
  //             method: "POST",

  //             body: JSON.stringify({ email: item }),

  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //           });
  //           const data = await res.json();
  //           console.log(data);

  //           setUserdataagain((prevData2) => [...prevData2, data]);
  //         } catch (err) {
  //           console.error(err);
  //           setError(err);
  //         }
  //       };
  //       fetchData2();
  //     });
  //   }
  // }, [array]);

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

    console.log(item);
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
            {item.user.profile_pic_name != "" ? (
              <Image
                style={{
                  margin: 10,
                  height: 50,
                  width: 50,
                  borderRadius: 360,
                }}
                source={{ uri: item.user.profile_pic_name }}
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
                {item.user.name}
              </Text>
              <Text
                style={{
                  fontSize: 20,

                  color: Colors.pink,
                  fontFamily: "GothicA1-Regular",
                }}
              >
                {item.user.userName}
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
              // marginLeft: 44,
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
