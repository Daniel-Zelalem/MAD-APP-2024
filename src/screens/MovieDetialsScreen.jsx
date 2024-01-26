import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StarIcon, HeartIcon } from "react-native-heroicons/solid";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Cast from "../components/Cast";
import MoveList from "../components/MoveList";
import {
  fallbackMoviePoster,
  fetchMovieCredits,
  fetchMovieDetails,
  fetchSimilarMovies,
  image500,
} from "../../api/moviedb";
import { styles, theme } from "../constants/theme";
import Loading from "../components/Loading";

import { FireBase_Auth } from "../../FirebaseConfig";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from "react-native-popup-menu";

const ios = Platform.OS == "ios";
const topMargin = ios ? "" : " mt-3";
var { width, height } = Dimensions.get("window");

const MovieDetailsScreen = () => {
  const { params: item } = useRoute();
  const navigation = useNavigation();
  const [movie, setMovie] = useState({});
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isFavourite, setIsFavourite] = useState(false);
  const [userRating, setUserRating] = useState({ count: 0, rating: 0 });
  const [selectedStar, setSelectedStar] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const user = FireBase_Auth.currentUser;
  const email = user ? user.email : "";

  useEffect(() => {
    setLoading(true);
    getMovieDetails(item.id);
    getMovieCredits(item.id);
    getSimilarMovies(item.id);

    const unsubscribe = FireBase_Auth.onAuthStateChanged((user) => {
      if (user) {
        const userEmail = user.email;
        setUserEmail(userEmail);
        retrieveUserRating(item.id, userEmail);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [item]);

  const calculateTotalRating = (userRating, movieRating) => {
    const totalRating = userRating.rating + (movieRating || 0);
    return {
      TotalRating: totalRating,
      totalRating,
    };
  };

  const getMovieCredits = async (id) => {
    const data = await fetchMovieCredits(id);
    if (data && data.cast) {
      setCast(data.cast);
    }
  };

  const getSimilarMovies = async (id) => {
    const data = await fetchSimilarMovies(id);
    if (data && data.results) {
      setSimilarMovies(data.results);
    }
  };

  const retrieveUserRating = async (movieId, email) => {
    try {
      const userRatingString = await AsyncStorage.getItem(
        `userRating_${email}_${movieId}`
      );

      if (userRatingString !== null) {
        const userRatingData = JSON.parse(userRatingString);
        const hasRated = userRatingData.count > 0;

        setUserRating({
          count: hasRated ? userRatingData.count : 0,
          rating: hasRated ? userRatingData.rating : 0,
        });

        setIsFavourite(hasRated && userRatingData.rating > 0);
        setSelectedStar(hasRated ? userRatingData.rating : 0);
      } else {
        setIsFavourite(false);
        setSelectedStar(0);
      }
    } catch (error) {
      console.error("Error retrieving user rating:", error);
    }
  };

  const handleAddToWatchlist = async () => {
    try {
      const currentWatchlist = await AsyncStorage.getItem(`watchlist_${email}`);
      const watchlist = currentWatchlist ? JSON.parse(currentWatchlist) : [];
      const isMovieInWatchlist = watchlist.some((m) => m.id === movie.id);
      if (isMovieInWatchlist) {
        Alert.alert(
          "Movie Already Exists",
          "This movie is already in your watchlist."
        );
      } else {
        watchlist.push(movie);
        await AsyncStorage.setItem(
          `watchlist_${email}`,
          JSON.stringify(watchlist)
        );
        Alert.alert(
          "Movie Added",
          "Movie added to your watchlist successfully!"
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleNavigateToWatchlist = () => {
    navigation.navigate("WatchListScreen", { email });
  };

  const handleMovieClick = () => {
    navigation.navigate("VirtualMovieScreen", { movie: movie });
  };

  const handleStarClick = async (star) => {
    if (userRating.count === 0) {
      setSelectedStar(star);
      saveUserRating(item.id, userEmail, star);
    } else {
      Alert.alert("Already Rated", "You have already rated this movie.");
    }
  };

  const saveToWatchlist = async (movie) => {
    try {
      const currentWatchlist = await AsyncStorage.getItem(`watchlist_${email}`);
      const watchlist = currentWatchlist ? JSON.parse(currentWatchlist) : [];
      const isMovieInWatchlist = watchlist.some((m) => m.id === movie.id);
      if (!isMovieInWatchlist) {
        watchlist.push(movie);
        await AsyncStorage.setItem(
          `watchlist_${email}`,
          JSON.stringify(watchlist)
        );
      }
    } catch (error) {
      console.error("Error saving to watchlist:", error);
    }
  };

  const saveUserRating = async (movieId, email, newRating) => {
    try {
      const prevUserRatingString = await AsyncStorage.getItem(
        `userRating_${email}_${movieId}`
      );

      let prevUserRating = {
        count: 0,
        rating: 0,
      };

      if (prevUserRatingString !== null) {
        prevUserRating = JSON.parse(prevUserRatingString);
      }

      const updatedUserRating = {
        count: prevUserRating.count + 1,
        rating: prevUserRating.rating + newRating,
      };

      await AsyncStorage.setItem(
        `userRating_${email}_${movieId}`,
        JSON.stringify(updatedUserRating)
      );

      setUserRating(updatedUserRating);

      const { TotalRating } = calculateTotalRating(
        updatedUserRating,
        movie.vote_average
      );

      setMovie({
        ...movie,
        total_rating: TotalRating,
      });

      setIsFavourite(updatedUserRating.rating > 0);
    } catch (error) {
      console.error("Error saving user rating:", error);
    }
  };

  const getMovieDetails = async (id) => {
    try {
      const data = await fetchMovieDetails(id);

      if (data) {
        const { TotalRating } = calculateTotalRating(
          userRating,
          data.vote_average
        );

        setMovie((prevMovie) => ({
          ...prevMovie,
          ...data,
          total_rating: TotalRating,
        }));
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  return (
    <MenuProvider>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        className="flex-1 bg-neutral-900"
      >
        <View className="w-full">
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

            <Menu>
              <MenuTrigger>
                <HeartIcon
                  size="35"
                  color={isFavourite ? theme.background : "white"}
                />
              </MenuTrigger>
              <MenuOptions
                optionsContainerStyle={{
                  backgroundColor: "white",
                  borderBottomRightRadius: 15,
                  borderBottomLeftRadius: 15,
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 10,
                  //marginTop: 30,
                }}
              >
                <MenuOption
                  onSelect={handleAddToWatchlist}
                  text="Add to Watchlist"
                  customStyles={{
                    optionText: {
                      fontSize: 20,
                      color: "#808080",
                      fontWeight: "bold",
                    },
                  }}
                />
                <MenuOption
                  onSelect={handleNavigateToWatchlist}
                  text="Join to Watchlist"
                  customStyles={{
                    optionText: {
                      fontSize: 20,
                      color: "#808080",
                      fontWeight: "bold",
                    },
                  }}
                />
              </MenuOptions>
            </Menu>
          </SafeAreaView>
          {loading ? (
            <Loading />
          ) : (
            <View>
              <Image
                source={{
                  uri: image500(movie.poster_path) || fallbackMoviePoster,
                }}
                style={{ width, height: height * 0.55 }}
              />
              <TouchableOpacity onPress={handleMovieClick}>
                <LinearGradient
                  colors={[
                    "transparent",
                    "rgba(23, 23, 23, 0.8)",
                    "rgba(23, 23, 23, 1)",
                  ]}
                  style={{ width, height: height * 0.4 }}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  className="absolute bottom-0"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ marginTop: -(height * 0.09) }} className="space-y-3">
          <Text className="text-white text-center text-3xl font-bold tracking-widest">
            {movie?.title}
          </Text>

          {movie?.id ? (
            <Text className="text-neutral-400 font-semibold text-base text-center">
              {movie?.status} • {movie?.release_date?.split("-")[0] || "N/A"} •{" "}
              {movie?.runtime} min
            </Text>
          ) : null}

          <View className="flex-row justify-center mx-4 space-x-2">
            {movie?.genres?.map((genre, index) => (
              <Text
                key={index}
                className="text-neutral-400 font-semibold text-base text-center"
              >
                {genre?.name} {index + 1 !== movie.genres.length ? "•" : null}
              </Text>
            ))}
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleStarClick(star)}
              >
                <StarIcon
                  size="24"
                  color={star <= selectedStar ? theme.background : "white"}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text
            style={{
              color: theme.text,
              fontSize: 16,
              textAlign: "center",
              marginVertical: 10,
            }}
          >
            {`Total-Rating: ${
              movie.total_rating && movie.total_rating > 0
                ? parseInt(movie.total_rating)
                : "N/A"
            }`}
          </Text>
        </View>

        {movie?.id && cast.length > 0 && (
          <Cast navigation={navigation} cast={cast} />
        )}

        {movie?.id && similarMovies.length > 0 && (
          <MoveList
            title={"Similar Movies"}
            hideSeeAll={true}
            data={similarMovies}
          />
        )}
      </ScrollView>
    </MenuProvider>
  );
};

export default MovieDetailsScreen;
