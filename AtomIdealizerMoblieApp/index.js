/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

//   const navigation = useNavigation(); 

PushNotification.configure({

    onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
        // navigation.navigate("SearchScreen" )
        // process the notification
    
        // (required) Called when a remote is received or opened, or local notification is opened
       
      },
     

})



AppRegistry.registerComponent(appName, () => App);
