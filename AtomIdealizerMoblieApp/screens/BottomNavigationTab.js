import * as React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text ,Button, TouchableOpacity,Image,Na} from 'react-native';
const HOME_OUTLINE = require("../assets/icons/outline_home_black_24dp.png");
const PROFILE_OUTLINE = require("../assets/icons/outline_account_circle_black_24dp.png");
// import i from "../AS"
const EXPLORE_OUTLINE = require("../assets/icons/outline_explore_black_24dp.png");

import PushNotification, {Importance} from 'react-native-push-notification';

const LOGO_IMAGE = require("../assets/icons/home.png");
const PROFILE= require("../assets/icons/baseline_account_circle_black_24dp.png");
const EXPLORE= require("../assets/icons/baseline_explore_black_24dp.png");
// const NOTIFICATION= require("../assets/icons/baseline_notifications_black_24dp.png");
const NOTIFICATION= require("../assets/icons/notifiaction-count.jpg");

const MENU= require("../assets/icons/baseline_menu_black_24dp.png");

// import NOTIFICATION from './assets/icons/notification.svg'


// Screens
import FeedScreen from './FeedScreen';
import SearchScreen from './SearchScreen';
import ProfileScreen from './ProfileScreen';

//Screen names
const homeName = "FeedScreen";
const detailsName = "SearchScreen";
const settingsName = "ProfileScreen";

const Tab = createBottomTabNavigator();
function BottomNavigationTab() {
  const navigation = useNavigation(); 
// 
  const handlePushNotification=()=>{
    PushNotification.localNotification({
      message: "My Notification Message", // (required)
      date: new Date(Date.now() + 60 * 1000), // in 60 secs
      allowWhileIdle: false, //
      channelId:'channel-id',
      
    }),
    PushNotification.localNotificationSchedule({
      //... You can use all the options from localNotifications
      channelId:'channel-id',

      message: "My Notification Message", // (required)
      date: new Date(Date.now() + 6 * 1000), // in 60 secs
      allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
    repeatTime:3,
    
  
      /* Android Only Properties */
    });    }
  return (
   
      <Tab.Navigator

        initialRouteName={homeName}
        screenOptions={({ route }) => ({
          tabBarShowLabel:false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === homeName) {
             return(
             focused? <Image 
              source={LOGO_IMAGE}
              style={{ width: 30, height: 30}} />:<Image
              source={HOME_OUTLINE}
              style={{ width: 30, height: 30}} />
             )

            } else if (rn === detailsName) {
              return(
                focused? <Image
                 source={EXPLORE}
                 style={{ width: 30, height: 30}} />:<Image
                 source={EXPLORE_OUTLINE}
                 style={{ width: 30, height: 30}} />
                )
            } else if (rn === settingsName) {
              return(
                focused? <Image
                 source={PROFILE}
                 style={{ width: 30, height: 30}} />:<Image
                 source={PROFILE_OUTLINE}
                 style={{ width: 30, height: 30}} />
                )        }

          },
        })}
        >

        <Tab.Screen
         name={homeName} 
         component={FeedScreen} 
         options={{
          headerTitleAlign:"center",
          headerLeftContainerStyle:{
            marginLeft:10

          },headerRightContainerStyle:{
            marginRight:10

          },
          headerLeft: () => (
            <View>
            <Image
            source={MENU}
            style={{ width: 24, height: 24, marginLeft: 12 }} />
        </View>
          ),
          headerRight:()=>(
            <TouchableOpacity onPress={()=>navigation.navigate("Notification")}>
          <View  >
              <Image 
              source={NOTIFICATION}
              style={{ width: 30, height: 30, marginLeft: 12 }} />
          </View>
         </TouchableOpacity>   
  )
        }}/>
        <Tab.Screen name={detailsName} component={SearchScreen} options={{
          headerShown:false
        }} />
        <Tab.Screen name={settingsName} component={ProfileScreen}
        options={{
          headerShown:false
        }} />

      </Tab.Navigator>
   
  );
}

export default BottomNavigationTab;