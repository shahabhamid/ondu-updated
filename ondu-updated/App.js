import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import SplashScreen from "./screens/splash-screen";
import LoginScreen from "./screens/login-screen";
import { useCallback, useEffect } from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';
import RegisterScreen from './screens/register-screen';
import HomePage from './screens/home-page-screen';
import Settings from './screens/settings';
import LanSelector from './screens/settings-pages/lan-selector';
import YourAccount from './screens/settings-pages/your-account';
import CreateEventScreen from './screens/create-event-screen';
import SendEvents from './screens/send-events';
import Events from './screens/events';
import EventDetails from './screens/event-details';
import SearchUserPage from './screens/search';
import OtherUser from './screens/profile-pages/other-user';
import AllFriends from './screens/all-chats/all-friends';
import Message from './screens/all-chats/message';

const Stack = createNativeStackNavigator();

export default function App() {

  const [fontsLoaded] = useFonts({
    "GothicA1-Bold": require("./fonts/GothicA1-Bold.ttf"),
    "GothicA1-Medium": require("./fonts/GothicA1-Medium.ttf"),
    "GothicA1-Regular": require("./fonts/GothicA1-Regular.ttf"),
    "GothicA1-SemiBold": require("./fonts/GothicA1-SemiBold.ttf"),
    "Montserrat-Italic-VariableFont_wght": require("./fonts/Montserrat-Italic-VariableFont_wght.ttf"),
    "Montserrat-VariableFont_wght": require("./fonts/Montserrat-VariableFont_wght.ttf"),
    "PathwayGothicOne-Regular": require("./fonts/PathwayGothicOne-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <RootSiblingParent>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreen">
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HomePage"
            component={HomePage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Settings"
            component={Settings}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Account"
            component={YourAccount}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LanSelector"
            component={LanSelector}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateEvent"
            component={CreateEventScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SendEvents"
            component={SendEvents}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Events"
            component={Events}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EventDetails"
            component={EventDetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="search"
            component={SearchUserPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Other_UserProfile"
            component={OtherUser}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="allFriends"
            component={AllFriends}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Messages"
            component={Message}
            options={{ headerShown: false }}
          />
          {/*   
     
    
       
      
        
     
    
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileBubble}
          options={{ headerShown: false }}
        />
     
     
      
       
       
        <Stack.Screen
          name="UploadProfile"
          component={UploadProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPass"
          component={ResetPass}
          options={{ headerShown: false }}
        /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
