import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import MovieHomeScreen from "../screens/MovieHomeScreen";
import MovieDetialsScreen from "../screens/MovieDetialsScreen";
import CollaborativeMovieReview from "../screens/CollaborativeMovieReview";
import NotificationScreen from "../screens/NotificationScreen";
import PersonScreen from "../screens/PersonScreen";
import SearchScreen from "../screens/SearchScreen";
import SettingScreen from "../screens/SettingScreen";
import VirtualMovieScreen from "../screens/VirtualMovieScreen";
import EditProfileScreen from "../screens/ EditProfileScreen";
import ProfileScreen from "../screens/ProfileScreen";
import WatchListScreen from "../screens/WatchListScreen";

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="MovieHomeScreen" component={MovieHomeScreen} />
        <Stack.Screen
          name="MovieDetialsScreen"
          component={MovieDetialsScreen}
        />
        <Stack.Screen name="PersonScreen" component={PersonScreen} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />
        <Stack.Screen
          name="CollaborativeMovieReview"
          component={CollaborativeMovieReview}
        />
        <Stack.Screen
          name="VirtualMovieScreen"
          component={VirtualMovieScreen}
        />
        <Stack.Screen name="SettingScreen" component={SettingScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen}/>
        <Stack.Screen name="WatchListScreen" component={WatchListScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
