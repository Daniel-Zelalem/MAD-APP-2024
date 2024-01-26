import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { darkGreen } from "../constants/Rule";
import Field from "../components/Field";
import Button from "../components/Button";
import { FireBase_Auth, FireStore } from "../../FirebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const RegisterScreen = (props) => {
  const [UName, setUName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const auth = FireBase_Auth;

  //email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^A-Z][^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  //pick profile
  const pickAvatar = async () => {
    try {
      const options = {
        title: "Pick Avatar",
        storageOptions: {
          skipBackup: true,
          path: "images",
        },
      };

      const result = await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        setAvatar(selectedAsset.uri);
      }
    } catch (error) {
      console.error("Image picker error:", error);
    }
  };

  const signup = async () => {
    setLoading(true);

    try {
      if (!UName || !Email || !Password || !Confirm) {
        //|| !avatar
        alert("All fields are required");
        return;
      }

      if (!validateEmail(Email)) {
        setEmailError("Invalid email format");
        return;
      }
      if (Password !== Confirm) {
        setPasswordError("Passwords do not match");
        return;
      }

      const response = await createUserWithEmailAndPassword(
        auth,
        Email,
        Password
      );

      if (response && response.user) {
        await updateProfile(response.user, {
          displayName: UName,
          photoURL: avatar,
        });

        await addDoc(collection(FireStore, "users"), {
          uid: response.user.uid,
          displayName: UName,
          email: Email,
          avatar: avatar,
          createdAt: serverTimestamp(),
        });
        props.navigation.navigate("LoginScreen");
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setUName("");
    setEmail("");
    setPassword("");
    setConfirm("");
    setAvatar(null);
    setLoading(false);
    setPasswordError("");
    setEmailError("");
  };

  useFocusEffect(
    React.useCallback(() => {
      resetState();
    }, [props.navigation])
  );

  return (
    <View className="flex-1 bg-neutral-800">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -200}
      >
        <View style={styles.container}>
          <Text style={styles.signupText}>Register</Text>

          <View style={styles.mainBody}>
            <View style={styles.formContainer}>
              <Field
                placeholder="User Name"
                keyboardType={"default"}
                value={UName}
                onChangeText={(text) => setUName(text)}
              />
              <Field
                placeholder="Email"
                keyboardType="email-address"
                value={Email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError("");
                }}
                autoCapitalize="none"
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}

              <View>
                <Field
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  value={Password}
                  onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 6, top: 40 }}
                >
                  <Text>{showPassword ? "Hide" : "Show"}</Text>
                </TouchableOpacity>
              </View>
              <View>
                <Field
                  placeholder="Confirm Password"
                  secureTextEntry={!showConfirmPassword}
                  value={Confirm}
                  onChangeText={(text) => {
                    setConfirm(text);
                    setPasswordError("");
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: "absolute", right: 6, top: 40 }}
                >
                  <Text>{showConfirmPassword ? "Hide" : "Show"}</Text>
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
            </View>
            <TouchableOpacity
              onPress={pickAvatar}
              style={{ color: "red", fontWeight: "bold" }}
            >
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>Pick Avatar</Text>
              )}
            </TouchableOpacity>
            <View>
              <View>
                {loading ? (
                  <ActivityIndicator size="large" color="#FF0000" />
                ) : (
                  <Button
                    textColor="white"
                    bgcolor="grey"
                    btnlable="Signup"
                    Press={signup}
                  />
                )}
              </View>
              <View style={styles.loginLinkContainer}>
                <Text style={styles.loginLinkText}>
                  Already have an account?
                </Text>
                <TouchableOpacity
                  onPress={() => props.navigation.navigate("LoginScreen")}
                >
                  <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: windowWidth * 0.1,
    marginTop: windowHeight * 0.05,
  },
  mainBody: {
    backgroundColor: "white",
    height: windowHeight * 0.76,
    width: windowWidth * 0.8,
    borderRadius: windowWidth * 0.2,
    paddingTop: windowWidth * 0.02,
    alignItems: "center",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
  avatarText: {
    color: darkGreen,
    fontSize: 20,
    marginTop: 10,
    fontWeight: "bold",
    marginBottom: windowHeight * 0.01,
  },
  signupText: {
    fontSize: windowWidth * 0.12,
    color: "#98EECC",
    fontWeight: "bold",
    marginBottom: windowWidth * 0.05,
  },
  errorText: {
    color: "red",
    marginTop: windowWidth * 0.01,
  },
  formContainer: {
    marginBottom: windowWidth * 0.05,
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: windowWidth * 0.01,
  },
  loginLinkText: {
    fontSize: windowWidth * 0.045,
  },
  loginLink: {
    color: darkGreen,
    fontWeight: "bold",
    fontSize: windowWidth * 0.05,
    marginLeft: windowWidth * 0.01,
  },
});

export default RegisterScreen;
