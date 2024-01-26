import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Platform,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import User from "react-native-vector-icons/EvilIcons";
import SearchIcon from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../constants/theme";
import {
  fetchTopRatedMovies,
  fetchTrendingMovies,
  fetchUpcomingMovies,
} from "../../api/moviedb";
import TrendingMovies from "../components/TrendingMovies";
import MoveList from "../../src/components/MoveList";
import { SafeAreaView } from "react-native-safe-area-context";
import Loading from "../components/Loading";

const ios = Platform.OS == "ios";
const MovieHomeScreen = () => {
  const navigation = useNavigation();
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSttingPress = () => {
    navigation.navigate("SettingScreen");
  };
  const handleSearchPress = () => {
    navigation.navigate("SearchScreen");
  };
  useEffect(() => {
    getTrendingMovies();
    getUpcomingMovies();
    getTopRatedMovies();
  }, []);

  const getTrendingMovies = async () => {
    const data = await fetchTrendingMovies();
    console.log("got trending", data.results.length);
    if (data && data.results) setTrending(data.results);
    setLoading(false);
  };
  const getUpcomingMovies = async () => {
    const data = await fetchUpcomingMovies();
    console.log("got upcoming", data.results.length);
    if (data && data.results) setUpcoming(data.results);
  };
  const getTopRatedMovies = async () => {
    const data = await fetchTopRatedMovies();
    console.log("got top rated", data.results.length);
    if (data && data.results) setTopRated(data.results);
  };
  return (
    <View
      style={{ flex: 1, backgroundColor: isDarkMode ? "white" : "#121212" }}
    >
      <SafeAreaView className={ios ? "-mb-2" : "mb-3"}>
        <StatusBar style="light" />
        <View className="flex-row items-center mx-3 my-2">
          <TouchableOpacity>
            <User
              name="user"
              onPress={handleSttingPress}
              size={40}
              strokeWidth={3}
              color={"#808080"}
            />
          </TouchableOpacity>

          <View className="flex-1 justify-center">
            <Text className="text-white text-3xl font-bold text-center">
              <Text style={styles.text}>Movies</Text>
            </Text>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity className="mr-6">
              <SearchIcon
                name="search1"
                onPress={handleSearchPress}
                size={30}
                strokeWidth={7}
                color={"#808080"}
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <Switch
                style={styles.toggleSwitch}
                value={isDarkMode}
                onValueChange={() => setIsDarkMode(!isDarkMode)}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {loading ? (
        <Loading />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          {/* Trending Movies*/}
          {trending.length > 0 && <TrendingMovies data={trending} />}

          {/* upcoming movies*/}
          {upcoming.length > 0 && <MoveList title="Upcoming" data={upcoming} />}

          {/* top rated movies*/}
          {topRated.length > 0 && (
            <MoveList title="Top Rated" data={topRated} />
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default MovieHomeScreen;
