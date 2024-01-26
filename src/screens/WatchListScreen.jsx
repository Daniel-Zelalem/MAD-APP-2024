import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import { styles, theme } from "../constants/theme";
import { fallbackMoviePoster, image500 } from "../../api/moviedb";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FireBase_Auth } from "../../FirebaseConfig";

const WatchListScreen = () => {
  const [watchlist, setWatchlist] = useState([]);
  const navigation = useNavigation();
  const [userEmail, setUserEmail] = useState("");
  const ios = Platform.OS == "ios";
  const topMargin = ios ? "" : " mt-3";

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      const user = FireBase_Auth.currentUser;

      if (user) {
        const userEmail = user.email;
        setUserEmail(userEmail);

        const watchlistData = await AsyncStorage.getItem(
          `watchlist_${userEmail}`
        );
        if (watchlistData) {
          setWatchlist(JSON.parse(watchlistData).reverse());
        }
      }
    } catch (error) {
      console.error("Error loading watchlist:", error);
    }
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      const updatedWatchlist = watchlist.filter((item) => item.id !== movieId);
      setWatchlist(updatedWatchlist);
      await AsyncStorage.setItem(
        `watchlist_${userEmail}`,
        JSON.stringify(updatedWatchlist)
      );
    } catch (error) {
      console.error("Error removing movie from watchlist:", error);
    }
  };

  const handleMovieClick = (movie) => {
    navigation.navigate("CollaborativeMovieReview", { movie });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="w-full flex-1 bg-neutral-900">
        <SafeAreaView
          className={
            "absolute z-20 w-full flex-row justify-between items-center px-4  mb-20 " +
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
              <Text style={styles.text}>M</Text>y Watchlist
            </Text>
          </View>
        </SafeAreaView>

        <View style={{ marginTop: 80 }}>
          {watchlist.length > 0 ? (
            <FlatList
              data={watchlist}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Swipeable
                  renderLeftActions={() => (
                    <TouchableOpacity
                      style={customStyles.swipeableAction}
                      onPress={() => removeFromWatchlist(item.id)}
                    >
                      <Text style={customStyles.swipeableText}>Remove</Text>
                    </TouchableOpacity>
                  )}
                >
                  <TouchableOpacity onPress={() => handleMovieClick(item)}>
                    <View style={customStyles.movieItem}>
                      <Image
                        source={{
                          uri:
                            image500(item.poster_path) || fallbackMoviePoster,
                        }}
                        style={customStyles.moviePoster}
                      />
                      <Text style={customStyles.movieTitle}>
                        {item.title.length > 15
                          ? `${item.title.substring(0, 15)}...`
                          : item.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Swipeable>
              )}
            />
          ) : (
            <Text style={customStyles.noMoviesText}>
              No movies in the watchlist
            </Text>
          )}
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const customStyles = StyleSheet.create({
  movieItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  moviePoster: {
    width: 210,
    height: 150,
    marginRight: 10,
  },
  movieTitle: {
    fontSize: 25,
    color: "grey",
  },
  noMoviesText: {
    fontSize: 20,
    color: theme.text,
    alignSelf: "center",
    marginTop: 20,
  },
  swipeableAction: {
    backgroundColor: "#ff5252",
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
    paddingRight: 20,
  },
  swipeableText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default WatchListScreen;
