/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
 import React, {useContext, useState, useEffect, useRef} from 'react';
 import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import {AuthContext, AuthProvider} from './screens/AuthContext';
import messaging from '@react-native-firebase/messaging';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text ,Button, TouchableOpacity,Image, AppState} from 'react-native';
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
import AddProfile from './screens/AddProfile';
import SplashScreen from './screens/SplashScreen';
import PushNotification from 'react-native-push-notification';
import firestore from '@react-native-firebase/firestore'
//Screen names
const homeName = "FeedScreen";
const detailsName = "SearchScreen";
const settingsName = "ProfileScreen";

const Tab = createBottomTabNavigator();



function Routes() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const Stack = createStackNavigator();

const {user, setUser} = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);
 const[notification,setNotification]=useState({ message: "Hope you enjoyed .Please take few minutes and rate your experience at the KottuKade",businessName:"KottuKade",bussinessImg:"https://firebasestorage.googleapis.com/v0/b/shopmedia-99e82.appspot.com/o/photos%2FEvuMiwOVkAEs7BH1658674802202.jpeg?alt=media&token=aa60e8f7-28ee-4f68-a453-2de29263e20b",businessId:"hUfL2rchxlS6nAjUrcEwVDyzmp73"})

  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {


        console.log("App has come to the foreground!");
      }else{
//         handlePushNotification();
       
//         firestore().collection('users'). 
//         doc(user.uid).   
//         update({
// notification:firestore.FieldValue.arrayUnion( notification)

//         })

      
       
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, [user]);


  const handlePushNotification=()=>{
    // PushNotification.localNotification({
    //   message: "Hi .Hope you enjoyed. Please take few minutes and rate the Business",
    //   subText:"Rate Here", // (required)
    //   date: new Date(Date.now() + 60 * 1000), // in 60 secs
    //   allowWhileIdle: false, //
    //   channelId:'channel-id',
      
    // })
    PushNotification.localNotificationSchedule({
      //... You can use all the options from localNotifications
      channelId:'channel-id',

      message: "Hi .Hope you enjoyed. Please take few minutes and rate the Business", // (required)
      date: new Date(Date.now() + 6 * 1000), // in 60 secs
      allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
    repeatTime:3,
    
  
      /* Android Only Properties */
    });    }
  if (initializing) return null;
  return (
    <NavigationContainer>
{user?<AppStack/>:<Stack.Navigator
initialRouteName="SplashScreen">
        {/* <Stack.Screen
          name="Home"
          component={BottomNavigationTab}
          options={{ title: 'Welcome' }}
        /> */}

<Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ title: '',headerShown:false }}
        />
         <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ title: '',headerShown:false }}
        />
         <Stack.Screen
          name="AddProfile"
          component={AddProfile}
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
