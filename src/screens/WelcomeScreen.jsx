import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Background from "../components/Background";
import Button from "../components/Button";
import { darkGreen, green } from "../constants/Rule";
import WelcomeIcon from "../../assets/welcom.png";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

// import * as Google from "expo-auth-session/providers/google";
// import * as WebBrowser from "expo-web-browser";
// import {
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signInWithCredential,
// } from "firebase/auth";
// import { FireBase_Auth } from "../../FirebaseConfig";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// WebBrowser.maybeCompleteAuthSession();

const WelcomeScreen = (props) => {
  // const [userInfo, setUserInfo] = React.useState();
  // const [req, res, promptAsync] = Google.useAuthRequest({
  //   androidClientId:
  //     "177488299512-gk1totn7geb59gef8ts1e82r0hv50nrj.apps.googleusercontent.com",
  // });

  // React.useEffect(() => {
  //   const signInWithGoogleAsync = async () => {
  //     if (res?.type === "success") {
  //       const { id_token } = res.params;
  //       const credential = GoogleAuthProvider.credential(id_token);
  //       try {
  //         await signInWithCredential(FireBase_Auth, credential);
  //       } catch (error) {
  //         console.error("Google sign-in error:", error);
  //       }
  //     }
  //   };

  //   signInWithGoogleAsync();
  // }, [res]);
  return (
    <Background>
      <View style={styles.container}>
        <View>
          <Image source={WelcomeIcon} style={styles.welcomeIcon} />
          <Text style={styles.appName}>Virtual Cinema</Text>
        </View>

        <View style={{ marginTop: windowHeight * 0.15 }}>
          <Button
            bgcolor="#98EECC"
            textColor={darkGreen}
            btnlable="Login"
            Press={() => props.navigation.navigate("LoginScreen")}
          />
          <Button
            bgcolor="#B6FFFA"
            textColor={darkGreen}
            btnlable="Signup"
            Press={() => props.navigation.navigate("RegisterScreen")}
          />
          <TouchableOpacity
            style={{
              shadow: { elevation: 3 },
              padding: 2,
              marginLeft: 2,
              borderRadius: 50,
              backgroundColor: "white",
              marginTop: 10,
            }}
            onPress={() => props.navigation.navigate("LoginScreen")}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                margin: 10,
                padding: 4,
              }}
            >
              <Image
                source={require("../../assets/google.png")}
                style={{ height: 28, width: 28 }}
              />
              <Text
                style={{
                  marginLeft: 10,
                  textAlign: "center",
                  color: "green",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Sign in With Google
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Background>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: windowHeight * 0.1,
    paddingHorizontal: windowWidth * 0.1,
    marginLeft: windowWidth * 0.05,
    marginRight: windowWidth * 0.06,
  },
  welcomeIcon: {
    width: windowWidth * 0.6,
    height: windowWidth * 0.4,
    marginLeft: windowWidth * 0.06,
    marginBottom: windowWidth * 0.1,
  },
  appName: {
    color: "#000000",
    fontSize: windowWidth * 0.102,
    fontStyle: "normal",
    fontWeight: "bold",
    marginBottom: windowWidth * 0.1,
  },
});
export default WelcomeScreen;
