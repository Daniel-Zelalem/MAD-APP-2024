import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { Video } from "expo-av";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../constants/theme";
import { Platform } from "react-native";
import { FireBase_Auth, FireStore } from "../../FirebaseConfig";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";

const CollaborativeMovieReview = ({ route }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [movieDetails, setMovieDetails] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const navigation = useNavigation();
  const swipeableRefs = useRef({});
  const [refresh, setRefresh] = useState(false);
  const ios = Platform.OS === "ios";
  const topMargin = ios ? "" : " mt-3";

  const auth = FireBase_Auth;
  const user = auth.currentUser;
  const movieId = route.params?.movie?.id;

  const handleReviews = async () => {
    if (newMessage.trim() !== "") {
      const userMessage = {
        text: newMessage,
        user: user.email,
        createdAt: serverTimestamp(),
        movieId: movieId,
      };

      await addDoc(collection(FireStore, "livechats"), userMessage);
      setNewMessage("");
    }
  };

  const handleDeleteMessage = async (message, swipeableRef) => {
    try {
      if (message.user === user.email) {
        await deleteDoc(doc(collection(FireStore, "livechats"), message.id));
        setRefresh(!refresh);
      } else {
        Alert.alert("You can only delete your own messages.");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    } finally {
      swipeableRef.current && swipeableRef.current.close();
    }
  };
  const fetchChats = async () => {
    try {
      const snapshot = await getDocs(
        query(
          collection(FireStore, "livechats"),
          where("movieId", "==", movieId),
          orderBy("createdAt", "desc")
        )
      );
      const livechats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChatMessages(livechats);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  useEffect(() => {
    fetchChats();

    const unsubscribe = onSnapshot(
      query(
        collection(FireStore, "livechats"),
        where("movieId", "==", movieId),
        orderBy("createdAt", "desc")
      ),
      (snapshot) => {
        const livechats = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChatMessages(livechats);
      }
    );

    return () => unsubscribe();
  }, [movieId, refresh]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const apiKey = "d420829d64630288b7f3c4750eda68d3";
        const movieId = route.params?.movie?.id;
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
        );
        const data = await response.json();
        setMovieDetails(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
    fetchMovieDetails();
  }, [movieId]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const renderRightActions = (progress, dragX, message) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity
        onPress={() => handleDeleteMessage(message, swipeableRefs[message.id])}
        style={styling.deleteButton}
      >
        <Text style={styling.deleteButtonText}>Remove</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      contentContainerStyle={{ paddingBottom: 20 }}
      className="flex-1 bg-neutral-900"
    >
      <View>
        <SafeAreaView
          className={
            "absolute z-20 w-full flex-row justify-between items-center px-4 " +
            topMargin
          }
        >
          <TouchableOpacity
            style={styles.background}
            className="rounded-xl p-1"
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
          </TouchableOpacity>
          <View className="flex-1 justify-center">
            <Text className="text-white text-3xl font-bold text-center">
              <Text style={styles.text}>R</Text>eview Screen
            </Text>
          </View>
        </SafeAreaView>
      </View>
      {movieDetails && (
        <>
          <Video
            source={{
              uri: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
            }}
            //source={{ uri: movieDetails.streamingLink }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay={isPlaying}
            useNativeControls
            style={styling.videoPlayer}
          />

          <Text style={styling.movieTitle}>{movieDetails.title}</Text>
        </>
      )}
      <View style={styling.chatContainer}>
        <Text style={styling.chatHeader}>Movie Reviews</Text>
        <GestureHandlerRootView>
          <FlatList
            data={chatMessages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Swipeable
                ref={(ref) => (swipeableRefs[item.id] = ref)}
                friction={2}
                renderRightActions={(progress, dragX) =>
                  renderRightActions(progress, dragX, item)
                }
              >
                <View style={styles.messageContainer}>
                  <Text style={{ marginLeft: 10, fontSize: 18 }}>
                    <Text style={{ color: "white" }}>
                      {item.user}{" "}
                      <Text style={{ color: "#FF9800", fontSize: 20 }}>:</Text>
                    </Text>
                    <Text style={{ color: "grey" }}> {item.text}</Text>
                  </Text>
                </View>
              </Swipeable>
            )}
          />
        </GestureHandlerRootView>
      </View>

      <View style={styling.inputContainer}>
        <TextInput
          style={styling.input}
          placeholder="Type your message..."
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
        />

        <TouchableOpacity onPress={handleReviews} style={styling.sendButton}>
          <Text style={styling.sendButtonText}>Ok</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styling = StyleSheet.create({
  videoPlayer: {
    width: "100%",
    height: 400,
    marginBottom: 10,
  },
  movieTitle: {
    color: "#6b7270",
    marginBottom: 10,
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 20,
  },
  chatContainer: {
    marginTop: 20,
    flex: 1,
  },
  chatHeader: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 10,
  },
  messageContainer: {
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    color: "#FFFFFF",
    paddingLeft: 5,
    justifyContent: "center",
    borderWidth: 1,
    marginRight: 10,
    marginLeft: 15,
  },
  sendButton: {
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
    alignItems: "center",
  },
  sendButtonText: {
    color: "white",
  },
  deleteButton: {
    padding: 5,
    backgroundColor: "red",
    borderRadius: 5,
    alignItems: "center",
    marginLeft: 10,
  },
  deleteButtonText: {
    color: "white",
  },
});

export default CollaborativeMovieReview;
