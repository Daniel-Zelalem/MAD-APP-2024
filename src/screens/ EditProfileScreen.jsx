import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Switch,
  Platform,
} from "react-native";
import {
  updateProfile,
  updateEmail,
  updatePassword,
  sendEmailVerification,
} from "firebase/auth";
import { FireBase_Auth as auth } from "../../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { onAuthStateChanged } from "firebase/auth";
import { fallbackUserPoster } from "../../api/moviedb";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../constants/theme";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
const EditProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userDisplayName, userPhotoURL, userEmail } = route.params;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(userDisplayName || "");
  const [newEmail, setNewEmail] = useState(userEmail || "");
  const [newPassword, setNewPassword] = useState("");
  const [newAvatar, setNewAvatar] = useState(userPhotoURL || "");
  const [avatar, setAvatar] = useState(null);
  const [currentUserAvatar, setCurrentUserAvatar] = useState(null);
  const ios = Platform.OS === "ios";

  // State variables to track whether each field is editable
  const [isDisplayNameEditable, setIsDisplayNameEditable] = useState(false);
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied for media library access");
      }
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserAvatar(user.photoURL);
        setNewDisplayName(user.displayName || "");
        setNewEmail(user.email || "");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSaveProfile = async () => {
    try {
      // Check if any changes have been made
      const profileChanged =
        newDisplayName !== userDisplayName ||
        newEmail !== userEmail ||
        newPassword !== "" ||
        newAvatar !== userPhotoURL;

      // Check if any required field is empty
      const anyFieldEmpty = !newDisplayName || !newEmail;

      if (!profileChanged) {
        Alert.alert("No changes made", "Exiting without updating.", [
          { text: "OK", onPress: () => navigation.navigate("ProfileScreen") },
        ]);
      } else if (anyFieldEmpty) {
        Alert.alert("Unable to update! Please fill in full information");
      } else {
        await updateProfile(auth.currentUser, {
          displayName: newDisplayName,
          photoURL: newAvatar || userPhotoURL,
        });

        // Update email
        if (newEmail) {
          await updateEmail(auth.currentUser, newEmail);
        }

        // Send email verification
        await sendEmailVerification(auth.currentUser);

        // Update password
        if (newPassword) {
          await updatePassword(auth.currentUser, newPassword);
        }

        // Successfully Updated
        Alert.alert("Updated Successfully", "", [
          {
            text: "OK",
            onPress: () => navigation.navigate("SettingScreen"),
          },
        ]);
      }
    } catch (error) {
      Alert.alert("Error updating profile:", error);
    }
  };

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
        setNewAvatar(selectedAsset.uri);
        setAvatar(selectedAsset.uri);
      }
    } catch (error) {
      Alert.alert("Image picker error:", error);
    }
  };

  const UndoeEdite = () => {
    navigation.navigate("MovieHomeScreen");
  };

  return (
    <View  style={{ flex: 1, backgroundColor: isDarkMode ? "white" : "#121212" }}>
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
            <Text style={styles.text}>Edite Profile</Text>
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
      </SafeAreaView>

      <View style={Styles.formContainer}>
        <View style={Styles.fieldContainer}>
          <View>
            <TouchableOpacity
              onPress={pickAvatar}
              style={Styles.avatarContainer}
            >
              {currentUserAvatar ? (
                <Image
                  source={{ uri: currentUserAvatar || fallbackUserPoster }}
                  style={Styles.avatarImage}
                />
              ) : (
                <Text style={Styles.pickAvatarText}>Pick Avatar</Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={Styles.inputContainer}>
            <TextInput
              style={Styles.input}
              placeholder="Enter new display name"
              value={newDisplayName}
              onChangeText={(text) => setNewDisplayName(text)}
              editable={isDisplayNameEditable}
            />
            <Switch
              style={Styles.toggleSwitch}
              value={isDisplayNameEditable}
              onValueChange={() =>
                setIsDisplayNameEditable(!isDisplayNameEditable)
              }
            />
          </View>
        </View>

        <View style={Styles.fieldContainer}>
          <View style={Styles.inputContainer}>
            <TextInput
              style={Styles.input}
              placeholder="Enter new email"
              value={newEmail}
              onChangeText={(text) => setNewEmail(text)}
              editable={isEmailEditable}
            />
            <Switch
              style={Styles.toggleSwitch}
              value={isEmailEditable}
              onValueChange={() => setIsEmailEditable(!isEmailEditable)}
            />
          </View>
        </View>
        <View style={Styles.fieldContainer}>
          <View style={Styles.inputContainer}>
            <TextInput
              style={Styles.input}
              placeholder="Enter new password"
              secureTextEntry
              value={newPassword}
              onChangeText={(text) => setNewPassword(text)}
              editable={isPasswordEditable}
            />
            <Switch
              style={Styles.toggleSwitch}
              value={isPasswordEditable}
              onValueChange={() => setIsPasswordEditable(!isPasswordEditable)}
            />
          </View>
        </View>
      </View>

      <View style={Styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => handleSaveProfile()}
          style={[Styles.saveButton, Styles.centerButton]}
        >
          <Text style={Styles.saveButtonText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => UndoeEdite()}
          style={[Styles.undoeButton, Styles.centerButton]}
        >
          <Text style={Styles.saveButtonText}>Undo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Styles = StyleSheet.create({
  formContainer: {
    borderRadius: 30,
    marginTop: 100,
    padding: 16,
    marginBottom: 30,
    alignItems: "center",
  },

  fieldContainer: {
    marginTop: 20,
  },
  input: {
    backgroundColor: "grey",
    color: "#000000",
    padding: 10,
    fontWeight: "bold",
    fontSize: 15,
    borderRadius: 15,
    marginBottom: 10,
    marginLeft: 5,
    width: 275,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 25,
    marginRight: 30,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  pickAvatarText: {
    color: "#FF0000",
    fontWeight: "bold",
    fontSize: 20,
  },
  centerButton: {
    width: 130,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    marginRight: 30,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
  },

  undoeButton: {
    backgroundColor: "grey",
    marginLeft: 5,
    padding: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleSwitch: {
    marginLeft: 2,
  },
});

export default EditProfileScreen;
