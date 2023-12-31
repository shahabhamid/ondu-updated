// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, initializeAuth, getReactNativePersistence} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// import {getMessaging} from "firebase/messaging";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkElucQeOhzcf2aLnJXCTTSQDU4MpeIbE",
  authDomain: "ondu-a5554.firebaseapp.com",
//   databaseURL: "https://ondu-a5554-default-rtdb.firebaseio.com/",
  projectId: "ondu-a5554",
  storageBucket: "ondu-a5554.appspot.com",
  messagingSenderId: "643836859984",
  appId: "1:643836859984:web:1c2f52285668705ab62355"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const FIRBASE_AUTH= getAuth(FIREBASE_APP);
export const FIREBASE_DATABASE=getDatabase(FIREBASE_APP);
export const FIREBASE_STORAGE=getStorage(FIREBASE_APP);