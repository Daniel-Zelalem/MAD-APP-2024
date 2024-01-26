import React, { useState } from "react";
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import LoginIcon from "../../assets/login.png";
import { darkGreen } from "../constants/Rule";
import Field from "../components/Field";
import Button from "../components/Button";
import { FireBase_Auth } from "../../FirebaseConfig";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const LoginScreen = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const auth = FireBase_Auth;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const signIn = async () => {
    setLoading(true);

    try {
      if (!validateEmail(email)) {
        setEmailError("Invalid email format");
        return;
      }

      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log("SignIn Response:", response);

      if (response) {
        props.navigation.navigate("MovieHomeScreen");
      } else {
        console.error("SignIn response is undefined.");
      }
    } catch (error) {
      console.error("Error during signIn:", error);
      alert("Authentication Failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendResetEmail = async () => {
    try {
      await sendPasswordResetEmail(auth, forgotPasswordEmail);
      alert("Password reset email sent successfully!");
    } catch (error) {
      console.error("Error sending reset email", error);
      alert("Error sending reset email");
    }
  };

  const resetState = () => {
    setEmail("");
    setPassword("");
    setLoading(false);
    setEmailError("");
    setShowForgotPassword(false);
    setForgotPasswordEmail("");
  };

  useFocusEffect(
    React.useCallback(() => {
      resetState();
    }, [props.navigation])
  );

  return (
    <View style={styles.container}>
      <Image source={LoginIcon} style={styles.loginIcon} />

      <View style={styles.mainBody}>
        <Text style={styles.loginText}>Login</Text>

        {!showForgotPassword && (
          <>
            <Field
              placeholder="Username or Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError("");
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
            <View>
              <Field
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 6, top: 40 }}
              >
                <Text>{showPassword ? "Hide" : "Show"}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {showForgotPassword && (
          <Field
            placeholder="Enter your email"
            value={forgotPasswordEmail}
            onChangeText={(text) => setForgotPasswordEmail(text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}

        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={() => setShowForgotPassword(!showForgotPassword)}
        >
          <Text style={styles.forgotPasswordText}>
            {showForgotPassword ? "Cancel" : "Forgot Password?"}
          </Text>
        </TouchableOpacity>

        {showForgotPassword ? (
          <View>
            <Button
              textColor="white"
              bgcolor="grey"
              btnlable="Reset"
              Press={sendResetEmail}
            />
          </View>
        ) : (
          <View>
            {loading ? (
              <ActivityIndicator size="large" color="#FF0000" />
            ) : (
              <Button
                textColor="white"
                bgcolor="grey"
                btnlable="Login"
                Press={signIn}
              />
            )}
          </View>
        )}

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account?</Text>
          <TouchableOpacity
            onPress={() => props.navigation.navigate("RegisterScreen")}
          >
            <Text style={styles.signupLink}>Signup</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.backContainer}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate("WelcomeScreen")}
          >
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F1F1F",
    alignItems: "center",
    justifyContent: "center",
  },
  loginIcon: {
    width: windowWidth * 0.4,
    height: windowWidth * 0.4,
    marginBottom: windowWidth * 0.05,
    borderRadius: windowWidth * 0.25,
  },
  mainBody: {
    backgroundColor: "white",
    height: windowHeight * 0.66,
    width: windowWidth * 0.8,
    borderRadius: windowWidth * 0.2,
    paddingTop: windowWidth * 0.02,
    alignItems: "center",
  },
  loginText: {
    fontSize: windowWidth * 0.1,
    color: darkGreen,
    fontWeight: "bold",
    marginBottom: windowWidth * 0.02,
  },
  errorText: {
    color: "red",
    marginTop: windowWidth * 0.01,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    width: windowWidth * 0.8,
    paddingRight: windowWidth * 0.04,
    marginBottom: windowWidth * 0.04,
  },
  forgotPasswordText: {
    color: darkGreen,
    fontWeight: "bold",
    fontSize: windowWidth * 0.05,
    paddingTop: windowWidth * 0.01,
    marginBottom: windowWidth * 0.08,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: windowWidth * 0.18,
  },
  signupText: {
    fontSize: windowWidth * 0.045,
  },
  signupLink: {
    color: darkGreen,
    fontWeight: "bold",
    fontSize: windowWidth * 0.05,
    marginLeft: windowWidth * 0.01,
  },
  backContainer: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    alignItems: "center",
  },
  backText: {
    color: "black",
    fontWeight: "bold",
    fontSize: windowWidth * 0.05,
  },
});

export default LoginScreen;
