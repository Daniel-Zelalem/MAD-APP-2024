import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  LogBox,
  Switch,
} from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import UserIcon from "react-native-vector-icons/Feather";
import NotificationIcon from "react-native-vector-icons/Ionicons";
import { styles } from "../constants/theme";
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
const ios = Platform.OS === "ios";

const SettingScreen = () => {
  const navigation = useNavigation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleNotificationPress = () => {
    navigation.navigate("NotificationScreen");
  };

  const handleProfilePress = () => {
    navigation.navigate("ProfileScreen");
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
          <ChevronLeftIcon size={28} strokeWidth={8} color="#D9534F"/>
        </TouchableOpacity>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text
            style={{
              color: isDarkMode ? "white" : "black",
              fontSize: 28,
              fontWeight: "bold",
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            <Text style={styles.text}>Settings</Text>
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

      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          marginLeft: 20,
          marginTop: 100,
        }}
      >
        <TouchableOpacity onPress={handleProfilePress} style={{ flexDirection: "row", alignItems: "center" }}>
          <UserIcon name="user" size={35} strokeWidth={5}   color={"#808080"} />
          <Text style={{ marginLeft: 10,   color:"#808080",fontSize:25}}>User Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNotificationPress} style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}>
          <NotificationIcon
            name="notifications-outline"
            size={35}
            strokeWidth={5}
            color={"#808080"}
          />
          <Text style={{ marginLeft: 10, color: "#808080",fontSize:25}}>Notifications</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingScreen;
