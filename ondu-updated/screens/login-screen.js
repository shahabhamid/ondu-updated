import {
  View,
  Dimensions,
  Pressable,
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
import axios from 'axios'
import apis from "../constants/static-ip";
import { Image } from "react-native";
import Toast from 'react-native-root-toast'
import { FIRBASE_AUTH } from "../Firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const { width, height } = Dimensions.get("window");
const size = Math.min(width, height) - 1;
export default function LoginScreen({ navigation }) {

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState(null);
  const passRef = React.useRef();
  const auth = FIRBASE_AUTH;

  const loginUser = async () =>{
    if (email == "" || password == "") {
      alert("Please enter email and password");
    } else {
      try {
        let toast = Toast.show('Authenticating...', {
          duration: Toast.durations.LONG,
        });
        const data = await signInWithEmailAndPassword(auth, email, password)
        console.log(data, 'data')
        Toast.hide(toast);
        navigation.navigate("HomePage");
      } catch (error) {
        console.log(JSON.stringify(error), 'Error - Login Screen');
        Alert.alert(error.status == 401 ? 'Invalid Credentials' : error.message);
      }
    }
  }
  return (
    <LinearGradientComponent>
      <View style={styles.rootScreen}>
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
          onSubmitEditing={() => passRef?.current?.focus()}
          style={styles.input}
          onPressIn={() => setErrorMsg(null)}
          onChangeText={(text) => setEmail(text)}
          placeholder="Email"
          autoComplete="email"
          keyboardType="email-address"
          returnKeyType={"next"}
        />
        <TextInput
          onSubmitEditing={() => {
            loginUser();
          }}
          style={styles.input}
          onPressIn={() => setErrorMsg(null)}
          onChangeText={(text) => setPassword(text)}
          placeholder="Password"
          secureTextEntry={true}
          autoComplete="password"
          refInner={passRef}
        />
        <PrimaryButton
          onPress={() => {
            loginUser();
          }}
        >
          Log In
        </PrimaryButton>
        <Pressable
          onPress={() => {
            navigation.navigate("ForgotPassword", { disabledAnimation: true });
          }}
        >
          <Text style={styles.forgotText}>{"Forgot Password?"}</Text>
        </Pressable>
        <Pressable onPress={() => { }}>
          <Text style={(styles.accountText, { marginTop: 50 })}>
            {"Don't have an account?"}
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
              navigation.navigate("Register", { disabledAnimation: true });
            }}
            android_ripple={{ color: Colors.highLightPurple }}
          >
            <Text style={styles.buttonText}>Create</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradientComponent>
  );
}

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textInputField: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  textLife: {
    fontFamily: "GothicA1-Bold",
    fontSize: 30,
    color: Colors.orange,
    marginBottom: 10,
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
