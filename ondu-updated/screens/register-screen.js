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
import Toast from "react-native-root-toast";
import { FIRBASE_AUTH, FIREBASE_DATABASE } from "../Firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { set, get, ref, query, orderByChild, equalTo } from "firebase/database";
const { width, height } = Dimensions.get("window");
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [email, setEmail] = React.useState("");
  const usernameRef = React.useRef();
  const passRef = React.useRef();
  const auth = FIRBASE_AUTH;
  const db = FIREBASE_DATABASE;

    //Notification
    const [expoPushToken, setExpoPushToken] = React.useState("");

    React.useEffect(() => {
      registerForPushNotificationsAsync().then((token) =>
        setExpoPushToken(token)
      );
    }, []);

    async function registerForPushNotificationsAsync() {
      let token;
  
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          alert("Failed to get push token for push notification!");
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
      } else {
        alert("Must use physical device for Push Notifications");
      }
  
      return token;
    }

  const handleSubmit = async () => {
    if (username == "" || name == "" || password == "" || email == "") {
      setErrorMsg("All fields are required");
      return;
    } else {
      let toast = Toast.show("Creating Account...", {
        duration: Toast.durations.LONG,
      });
      try {
      // Check if the username already exists
      const usernameRef = ref(db, "users");
      const usernameQuery = query(usernameRef, orderByChild("username"), equalTo(username));
      const usernameSnapshot = await get(usernameQuery);

      if (usernameSnapshot.exists()) {
        Toast.hide(toast);
        setErrorMsg("Username already exists. Please choose a different username.");
        return;
      }

        const response = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const userID = response.user.uid;
        // console.log(userID, "user");

        const data = {
          _id: userID,
          username: username,
          name: name,
          email: email,
          profile_pic_name: "",
          bio: "",
          links: "",
          followers: "",
          following: "",
          accountEvents: "",
          accountEventsFrom: "",
          // token: "",
          token: expoPushToken,
        };

        // Store the user data object in Firebase Realtime Database
        const usersRef = ref(db, "users/"+ userID); 
        await set(usersRef, data);

        Toast.hide(toast);
        setName("");
        setUsername("");
        setPassword("");
        setEmail("");
        navigation.navigate("HomePage", { data });
      } catch (error) {
        console.log(error, "error");
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
          onChangeText={(text) => setEmail(text)}
          placeholder="Email"
          autoComplete="email"
          keyboardType="email-address"
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
        <Pressable onPress={() => {}}>
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
