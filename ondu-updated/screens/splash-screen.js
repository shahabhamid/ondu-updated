import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import LinearGradientComponent from "../components/linear-gradient-component";
import Colors from "../constants/colors";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Login");
    }, 3000);
  }, []);

  return (
    <LinearGradientComponent>
      <View style={styles.container}>
        <Image style={styles.logo} source={require("../assets/Ondoapp.png")} />
        <Text style={styles.text}>Play</Text>
        <Text style={styles.textLife}>Your Life</Text>
      </View>
    </LinearGradientComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "100%",
    height: "50%",
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
});

export default SplashScreen;
