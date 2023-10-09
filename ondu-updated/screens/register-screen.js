import {
  View,
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Alert,
} from "react-native";
import Colors from "../constants/colors";
import * as React from "react";
import PrimaryButton from "../components/primary-button";
import LinearGradientComponent from "../components/linear-gradient-component";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apis from "../constants/static-ip";
import { Image } from "react-native";
import axios from 'axios'
import Toast from "react-native-root-toast";
const { width, height } = Dimensions.get("window");

export default function RegisterScreen({ navigation }) {
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState(null);
  const usernameRef = React.useRef();
  const passRef = React.useRef();

  const handleSubmit = async () => {
    if (username == "" || name == "" || password == "") {
      setErrorMsg("All fields are required");
      return;
    } else {
      let toast = Toast.show('Creating Account...', {
        duration: Toast.durations.LONG,
      });
      try {
        const data = await axios.post(`${apis}/signup`, {
          name: name,
          password: password,
          username: username
        })

        await AsyncStorage.setItem("user", JSON.stringify(data.data.user));
        await AsyncStorage.setItem("token", JSON.stringify(data.data.token));
        Toast.hide(toast);
        navigation.navigate("HomePage", { data });
      } catch (error) {
        console.log(error, 'error')
        setErrorMsg(error.message);
      }
    }
  };

  return (
    <LinearGradientComponent>
      <SafeAreaView style={styles.rootScreen}>
        <Image
          style={{ height: "10%", width: "60%" }}
          source={require("../assets/OndoPrimary1.png")}
        />
        <View style={styles.textInputField}>
          <Text style={styles.text}>Play</Text>
          <Text style={styles.textLife}>Your Life</Text>
        </View>
        {errorMsg ? <Text style={styles.errorMessage}>{errorMsg}</Text> : null}

        <TextInput
          onSubmitEditing={() => usernameRef?.current?.focus()}
          style={styles.input}
          onPressIn={() => setErrorMsg(null)}
          onChangeText={(text) => setName(text)}
          placeholder="Full Name"
          autoComplete="name"
          autoCapitalize="words"
          returnKeyType={"next"}
        />
        <TextInput
          style={styles.input}
          onPressIn={() => setErrorMsg(null)}
          onChangeText={(texts) => setUsername(texts)}
          placeholder="Username"
          autoCorrect={false}
          onSubmitEditing={() => passRef?.current?.focus()}
          returnKeyType={"next"}
        />
        <TextInput
          onSubmitEditing={() => {
            handleSubmit();
          }}
          style={styles.input}
          onPressIn={() => setErrorMsg(null)}
          onChangeText={(texts) => setPassword(texts)}
          placeholder="Password"
          secureTextEntry={true}
          autoComplete="password"
        />
        <PrimaryButton
          onPress={() => {
            handleSubmit();
          }}
        >
          Register
        </PrimaryButton>
        <Pressable onPress={() => { }}>
          <Text style={(styles.accountText, { marginTop: 50 })}>
            {"Already have an account?"}
          </Text>
        </Pressable>
        <View style={styles.buttonOuterContainer}>
          <Pressable
            style={({ pressed }) =>
              pressed
                ? [styles.buttonInnerContainer, styles.pressed]
                : styles.buttonInnerContainer
            }
            onPress={() => {
              navigation.navigate("Login", { disabledAnimation: true });
            }}
            android_ripple={{ color: Colors.highLightPurple }}
          >
            <Text style={styles.buttonText}>Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradientComponent>
  );
}

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  textLife: {
    fontFamily: "GothicA1-Bold",
    fontSize: 30,
    color: Colors.orange,
    marginBottom: 10,
  },
  textInputField: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "GothicA1-Bold",
    fontSize: 30,
    color: Colors.pink,
  },
  input: {
    height: 40,
    width: width * 0.7,
    fontFamily: "GothicA1-Medium",
    margin: 10,
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: Colors.pink,
  },
  forgotText: {
    fontFamily: "GothicA1-SemiBold",
  },
  accountText: {
    fontFamily: "PathwayGothicOne-Regular",
    marginTop: 50,
  },
  buttonOuterContainer: {
    borderRadius: 28,
    width: width * 0.25,
    marginTop: 8,

    overflow: "hidden",
  },
  buttonInnerContainer: {
    backgroundColor: Colors.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 2,
  },
  buttonText: {
    color: Colors.brown,
    textAlign: "center",
    fontFamily: "GothicA1-Regular",
  },
  pressed: {
    opacity: 0.75,
  },
  errorMessage: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
    backgroundColor: "#F50057",
    padding: 5,
    borderRadius: 10,
  },
});
