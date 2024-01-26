import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  Image,
  LogBox,
  Switch,
} from "react-native";
import { ChevronLeftIcon, PencilIcon } from "react-native-heroicons/outline";
import { styles } from "../constants/theme";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FireBase_Auth as auth } from "../../FirebaseConfig";
import { fallbackUserPoster } from "../../api/moviedb";
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
const ios = Platform.OS === "ios";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("User Info:", user);
      setUser(user);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigation.navigate("WelcomeScreen");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleEditProfile = () => {
    if (user) {
      navigation.navigate("EditProfileScreen", {
        userDisplayName: user.displayName,
        userPhotoURL: user.photoURL,
        userEmail: user.email,
      });
    }
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: isDarkMode ? "white" : "#121212" }}
    >
      <SafeAreaView
        style={{
          position: "absolute",
          top: ios ? 20 : 10,
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 15,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeftIcon size={28} strokeWidth={8} color="#D9534F" />
        </TouchableOpacity>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text
            style={{
              color: "white",
              fontSize: 28,
              fontWeight: "bold",
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            <Text style={styles.text}>Setting</Text>
          </Text>
        </View>
        <View style={{ marginRight: 10 }}>
          <TouchableOpacity>
            <Switch
              style={styles.toggleSwitch}
              value={isDarkMode}
              onValueChange={() => setIsDarkMode(!isDarkMode)}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handleSignOut}
          style={{
            padding: 5,
          }}
        >
          <Text style={{ color: "red", fontSize: 20, fontWeight: "bold" }}>
            LogOut
          </Text>
        </TouchableOpacity>
      </SafeAreaView>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {loading ? (
          <Text style={{ color: "white" }}>Loading...</Text>
        ) : user ? (
          <>
            <View
              style={{
                //borderWidth: 4,
                borderColor: "#000000",
                borderRadius: 50,
                overflow: "hidden",
                marginBottom: 16,
              }}
            >
              <Image
                source={{ uri: user.photoURL || fallbackUserPoster }}
                style={{ width: 250, height: 250, borderRadius: 110 }}
              />
              <TouchableOpacity
                onPress={handleEditProfile}
                style={styles.editProfileButton}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PencilIcon size={22} color="#F99417" strokeWidth={3} />
                  <Text style={{ color: "#e60c0c", fontSize: 25 }}> Edit</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  color: "grey",
                  fontSize: 25,
                  fontWeight: "bold",
                  marginBottom: 8,
                }}
              >
                {user.displayName}
              </Text>

              <Text
                style={{ color: "#808080", fontWeight: "bold", fontSize: 20 }}
              >
                {user.email}
              </Text>
            </View>
          </>
        ) : (
          <Text style={{ color: "white" }}>User not found</Text>
        )}
      </View>
    </View>
  );
};
export default ProfileScreen;
