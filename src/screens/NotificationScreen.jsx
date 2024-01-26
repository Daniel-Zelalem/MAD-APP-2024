import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  Switch,
} from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { styles } from "../constants/theme";
import Loading from "../components/Loading";
import { fetchNotifications } from "../../api/moviedb";

const ios = Platform.OS === "ios";

const NotificationScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotificationIndex, setSelectedNotificationIndex] =
    useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetchNotificationData();
  }, []);

  const fetchNotificationData = async () => {
    try {
      const NotificationData = await fetchNotifications();
      if (NotificationData && NotificationData.results) {
        setNotifications(NotificationData.results);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (index) => {
    setSelectedNotificationIndex(index);
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
            <Text style={styles.text}>Notifications</Text>
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

      <ScrollView style={{ paddingBottom: 20, marginTop: 60 }}>
        {loading ? (
          <Loading />
        ) : (
          <View>
            {notifications.length > 0 ? (
              <ScrollView>
                {notifications.map((notification, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleNotificationClick(index)}
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <Text
                      style={{
                        color: "#808080",
                        padding: 20,
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {notification.id || "Notification Text Missing"}
                    </Text>
                    {selectedNotificationIndex === index && (
                      <View
                        style={{
                          backgroundColor: "#808080",
                          padding: 30,
                          width: 350,
                          borderRadius: 10,
                        }}
                      >
                        {notification.additionalDetails && (
                          <Text style={{ color: "#808080" }}>
                            {notification.additionalDetails}
                          </Text>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <Text
                style={{
                  color: "red",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: 20,
                  marginTop: 100,
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                No notifications yet
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default NotificationScreen;
