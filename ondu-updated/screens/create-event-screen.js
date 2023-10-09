import React, { useEffect, useRef, useState } from "react";
import RadioButton, {
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import Colors from "../constants/colors";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const socket = io("http://192.168.100.7:3002");
import apis from "../constants/static-ip";
import { ScrollView } from "react-native";
import { language } from "../constants/language";
import CustomBubble from "../components/bubble-custom";
import axios from "axios";
const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;

function CreateEventScreen({ navigation }) {
  const [isActive, setIsActive] = useState();
  const [load, setIsLoad] = useState(false);
  const [selectLan, setSelectLan] = useState(0);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(new Date());
  const [text, onChangeText] = React.useState("");
  const [desc, onChangeDesc] = React.useState("");
  const progress = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const month = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  var radio_props = [
    { label: "Private", value: 0 },
    { label: "Public", value: 1 },
  ];
  useEffect(() => {
    getLang();
  }, []);
  const getLang = async () => {
    setSelectLan(parseInt(await AsyncStorage.getItem("LANG")) || 0);
  };

  useEffect(() => {
    Animated.timing(progress, { toValue: 1, useNativeDriver: true }).start();
    Animated.timing(scale, { toValue: 1.3, useNativeDriver: true }).start();
  }, []);

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDate(date)
    hideDatePicker();
  };

  const showDatepicker = () => {
    setDatePickerVisibility(true);
  };

  const eventSet = async () => {
    if (text === "" || date === "" || desc === "") {
      alert("Please fill all the fields");
    } else {
      setIsLoad(true);
      try {
        const user = await AsyncStorage.getItem("user")
        console.log(user, 'user')
        const data = await axios.post(`${apis}/addEvent`, {
          userId: JSON.parse(user)._id,
          name: text,
          date: date,
          desc: desc,
          isPrivate: isActive == 1 ? false : true,
        })

        socket.emit(
          "eventName",
          JSON.stringify({
            userId: JSON.parse(user)._id,
            name: text,
            date: date,
            desc: desc,
            isPrivate: isActive == 1 ? false : true,
          })
        );
        onChangeText("");
        setIsLoad(false)
        Alert.alert("Event Added Successfully");
        navigation.navigate(
          "SendEvents",
          { data: JSON.parse(user).username },
          { disabledAnimation: true }
        );
      } catch (error) {
        setIsLoad(false)
        Alert.alert("Wrong Password\n" + error.message);
      }
    }
  };


  return (
    <CustomBubble
      bubbleColor={Colors.brown}
      crossColor={Colors.pink}
      navigation={navigation}
    >
      <View
        style={{ width: "100%", flexDirection: "column", marginHorizontal: 6 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={true}
          style={{
            marginBottom: size / 10,
            marginTop: size / 12,
            height: "100%",
          }}
        >
          <View style={styles.root}>
            <Text style={[styles.fontDesign, { fontSize: 24 }]}>
              {selectLan == 0 ? language[2].eng : language[2].arab}
            </Text>
            <View style={styles.anRoot}>
              <Text style={styles.fontDesign}>
                {selectLan == 0 ? language[20].eng : null}
              </Text>
              <TextInput
                textAlign="center"
                cursorColor={Colors.brown}
                style={styles.input}
                onChangeText={onChangeText}
                value={text}
              />
              <Text style={styles.fontDesign}>
                {selectLan == 0 ? null : language[20].arab}
              </Text>
            </View>
            <View style={styles.anRoot}>
              <Text style={styles.fontDesign}>
                {selectLan == 0 ? language[21].eng : null}
              </Text>
              <TextInput
                textAlign="center"
                cursorColor={Colors.brown}
                style={[styles.input]}
                onChangeText={onChangeDesc}
                value={desc}
              />
              <Text style={styles.fontDesign}>
                {selectLan == 0 ? null : language[21].arab}
              </Text>
            </View>
            <View style={styles.anRoot}>
              <Text style={styles.fontDesign}>
                {selectLan == 0 ? language[22].eng : null}
              </Text>

              <Pressable
                onPress={showDatepicker}
                title="Pick Date"
              >
                <View style={{ flexDirection: "row" }}>
                  <View style={[styles.dateIn, { height: 18, width: 30 }]}>
                    <Text style={styles.fontDesign1}>
                      {date.getDate().toLocaleString()}
                    </Text>
                  </View>
                  <View style={[styles.dateIn, { height: 18, width: 50 }]}>
                    <Text style={styles.fontDesign1}>
                      {month[date.getMonth().toLocaleString()]}
                    </Text>
                  </View>
                  <View style={[styles.dateIn, { height: 18, width: 40 }]}>
                    <Text style={styles.fontDesign1}>
                      {date.getFullYear().toLocaleString()}
                    </Text>
                  </View>
                </View>
              </Pressable>
              <Text style={styles.fontDesign}>
                {selectLan == 0 ? null : language[22].arab}
              </Text>
            </View>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
            <View
              style={{
                marginTop: size / 25,
                marginRight: size / 7,
                flexDirection: "row",
              }}
            >
              <Text style={[styles.fontDesign, { marginRight: 5 }]}>
                Privacy
              </Text>
              <View style={{ flexDirection: "column" }}>
                {radio_props.map((obj, i) => (
                  <RadioButton labelHorizontal={false} key={i}>
                    <View style={styles.lanItem}>
                      <RadioButtonInput
                        obj={obj}
                        index={i}
                        isSelected={isActive === i}
                        onPress={(value) => setIsActive(value)}
                        borderWidth={0}
                        buttonInnerColor={Colors.pink}
                        buttonOuterColor={Colors.white}
                        buttonSize={12}
                        buttonOuterSize={18}
                      />
                      <RadioButtonLabel
                        obj={obj}
                        index={i}
                        onPress={(value) => setIsActive(value)}
                        labelStyle={[
                          styles.fontDesign1,
                          {
                            color: Colors.pink,
                            fontSize: 14,
                            marginLeft: 4,
                            marginBottom: 10,
                          },
                        ]}
                      />
                    </View>
                  </RadioButton>
                ))}
              </View>
            </View>
            {!load ? (
              <Pressable
                style={[styles.dateIn, { height: 20, width: 40, marginTop: 8 }]}
                onPress={() => {
                  eventSet();
                }}
              >
                <Text style={styles.fontDesign1}>Set</Text>
              </Pressable>
            ) : (
              <ActivityIndicator />
            )}
          </View>
        </ScrollView>
      </View>

    </CustomBubble>
  );
}
export default CreateEventScreen;

const styles = StyleSheet.create({
  root: {
    marginBottom: size / 10,
    alignItems: "center",
    flexDirection: "column",
  },
  anRoot: {
    marginTop: size / 25,
    flexDirection: "row",
    alignItems: "center",
  },
  fontDesign: {
    textAlign: "center",
    fontFamily: "GothicA1-Regular",
    color: Colors.white,
    fontSize: 18,
    marginRight: 5,
  },
  fontDesign1: {
    textAlign: "center",
    fontSize: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
    justifyContent: 'center',
    backgroundColor: Colors.pink,
    borderRadius: 24,
    borderColor: Colors.pink,
    color: Colors.white,
    borderBottomColor: Colors.pink,
    borderBottomColor: "#000",
    overflow: "hidden",
  },
  lanItem: {
    width: "100%",
    height: 30,
    color: Colors.pink,
    flexDirection: "row",
    marginTop: 5,
    alignItems: "flex-start",
  },
  icon: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    width: 16,
    height: 16,
  },
  input: {
    height: 18,
    textAlign: "center",
    fontSize: 12,
    width: size / 3,
    fontFamily: "GothicA1-Medium",
    backgroundColor: Colors.pink,
    borderRadius: 24,
    borderColor: Colors.pink,
    color: Colors.white,
    borderBottomColor: Colors.pink,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    borderBottomColor: "#000",
    overflow: "hidden",
  },
});
