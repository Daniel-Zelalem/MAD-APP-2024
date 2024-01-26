import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth as getFirestoreAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhG-hW86UKCyD_oTEe2tfC46gXi2P5HWE",
  authDomain: "virtual-cinema-app.firebaseapp.com",
  projectId: "virtual-cinema-app",
  storageBucket: "virtual-cinema-app.appspot.com",
  messagingSenderId: "214305325871",
  appId: "1:214305325871:web:7cdef5d161a253745c97da",
};

// Initialize Firebase
export const FireBase_App = initializeApp(firebaseConfig);
export const FireBase_Auth = initializeAuth(FireBase_App, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const FireStore = getFirestore(FireBase_App);
