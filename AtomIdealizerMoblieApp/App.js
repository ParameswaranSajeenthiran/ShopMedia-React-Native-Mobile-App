/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
 import React, {useContext, useState, useEffect} from 'react';
 import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import {AuthContext, AuthProvider} from './screens/AuthContext';


import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text ,Button, TouchableOpacity,Image} from 'react-native';
const HOME_OUTLINE = require("./assets/icons/outline_home_black_24dp.png");
const PROFILE_OUTLINE = require("./assets/icons/outline_account_circle_black_24dp.png");

const EXPLORE_OUTLINE = require("./assets/icons/outline_explore_black_24dp.png");


const LOGO_IMAGE = require("./assets/icons/home.png");
const PROFILE= require("./assets/icons/baseline_account_circle_black_24dp.png");
const EXPLORE= require("./assets/icons/baseline_explore_black_24dp.png");
const NOTIFICATION= require("./assets/icons/baseline_notifications_black_24dp.png");
const MENU= require("./assets/icons/baseline_menu_black_24dp.png");

// import NOTIFICATION from './assets/icons/notification.svg'


// Screens
import FeedScreen from './screens/FeedScreen';
import SearchScreen from './screens/SearchScreen';
import ProfileScreen from './screens/ProfileScreen';
import BottomNavigationTab from './screens/BottomNavigationTab';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import AppStack from './screens/AppStack';

//Screen names
const homeName = "FeedScreen";
const detailsName = "SearchScreen";
const settingsName = "ProfileScreen";

const Tab = createBottomTabNavigator();



function Routes() {
  const Stack = createStackNavigator();

const {user, setUser} = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);

  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;
  return (
    <NavigationContainer>
{user?<AppStack/>:<Stack.Navigator
initialRouteName='SignUp'>
        {/* <Stack.Screen
          name="Home"
          component={BottomNavigationTab}
          options={{ title: 'Welcome' }}
        /> */}
         <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ title: '',headerShown:false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login',
          headerShown:false ,
 }}
        />
      
      </Stack.Navigator>}



  
    </NavigationContainer>
  );
}
function App(){
 return(  <AuthProvider><Routes/></AuthProvider>)
}
export default App;
