import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Text, View ,AppState} from 'react-native';
import AddPostScreen from './AddPostScreen';
import AddProfile from './AddProfile';
import BottomNavigationTab from './BottomNavigationTab';
import BusinessProfileScreen from './BusineesProfilleScreen';
import businessProfileScreen from './BusineesProfilleScreen';
import BusinessFeedScreen from './BusinessFeeedScreen'
import EditProfileScreen from './EditProfile';
import EditProfile from './EditProfile';
import ProductScreen from './ProductScreen';
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from './AuthContext';
import Notification from './Notification';
import PushNotification from 'react-native-push-notification';
// import firestore from '@react-native-firebase/firestore'

export default function AppStack(){
  const {user, logout} = React.useContext(AuthContext);

    const AppStack=createStackNavigator()
    const [isFirstLaunch, setIsFirstLaunch] = React.useState(false);
    const [routeName, setRouteName] = React.useState(false);

    const [userData, setUserData] =React. useState(null);
    const appState = React.useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = React.useState(appState.current);
  
    const Stack = createStackNavigator();
  
    const [initializing, setInitializing] = React.useState(true);
   const[notification,setNotification]=React.useState({ message: "Hope you enjoyed .Please take few minutes and rate your experience at the KottuKade",businessName:"KottuKade",bussinessImg:"https://firebasestorage.googleapis.com/v0/b/shopmedia-99e82.appspot.com/o/photos%2FEvuMiwOVkAEs7BH1658674802202.jpeg?alt=media&token=aa60e8f7-28ee-4f68-a453-2de29263e20b",businessId:"hUfL2rchxlS6nAjUrcEwVDyzmp73"})
  


    React.useEffect(() => {

      // getUser()
    AsyncStorage.getItem('signedUp').then((value) => {
        console.log(value,"vlaue")
        if (value == 'true') {
          console.log(value,"vlaue")
          // AsyncStorage.setItem('signedUp', ''); // No need to wait for `setItem` to finish, although you might want to handle errors
          setIsFirstLaunch(true);
          setRouteName(true)
        } else {
          setRouteName(true)
        }

        // if (isFirstLaunch === null) {
        //   return null; // This is the 'tricky' part: The query to AsyncStorage is not finished, but we have to present something to the user. Null will just render nothing, so you can also put a placeholder of some sort, but effectively the interval between the first mount and AsyncStorage retrieving your data won't be noticeable to the user. But if you want to display anything then you can use a LOADER here
        // } else if (isFirstLaunch == true) {
        //   routeName = 'AddProfile';
        // } else {
        //   routeName = 'BottomTabNavigation';
        // }
      }); 
  
    }, []);
   
    React.useEffect(() => {
      const subscription = AppState.addEventListener("change", nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
  
  
          console.log("App has come to the foreground!");
        }else{
          handlePushNotification();
         
          firestore().collection('users'). 
          doc(user.uid).   
          update({
  notification:firestore.FieldValue.arrayUnion( notification)
  
          })
  
        
         
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
  
        message: "Had a delicious meal at Burger Hut ? Rate for a streak", // (required)
        date: new Date(Date.now() + 6 * 1000), // in 60 secs
        allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
      repeatTime:3,
      
    
        /* Android Only Properties */
      });    }
    const getUser = async() => {
      const currentUser = await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then((documentSnapshot) => {
        if( documentSnapshot.exists ) {
          console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
         setRouteName(true)
          console.log("userDAta",userData)
        }
  
      })
    }
  
if(routeName){
    return(
        <AppStack.Navigator
        initialRouteName={isFirstLaunch? "AddProfileScreen":"BottomTabNavigation"}
        
      //  initialRouteName='BottomTabNavigation'
       >
         <AppStack.Screen
          name="BottomTabNavigation"
          component={BottomNavigationTab}
          options={{ title: '',headerShown:false }}
        /> 
        <AppStack.Screen
        name="Product"
        component={ProductScreen}
        options={{ title: '',headerShown:false }}
      />
       <AppStack.Screen
        name="addPost"
        component={AddPostScreen}
        options={{ title:'',headerBackTitle:'cancel'
          }}
      />
       <AppStack.Screen
        name="editProfile"
        component={EditProfileScreen}
        options={{ title: 'Post Product' , headerTitleAlign:"center",
          }}
      />
       <AppStack.Screen
        name="businessProfileScreen"
        component={BusinessProfileScreen}
        options={{ title: 'Business Profile Screen' , headerTitleAlign:"center",headerShown:false
          }}
      />
      <AppStack.Screen
        name="BusinessFeedScreen"
        component={BusinessFeedScreen}
        options={{ title: 'Business Profile Screen' , headerTitleAlign:"center",headerShown:false
          }}
      />
       <AppStack.Screen
        name="AddProfileScreen"
        component={AddProfile}
        options={{ title: '' , headerTitleAlign:"center",headerShown:false
          }}
      />
       <AppStack.Screen
        name="Notification"
        component={Notification}
        options={{ title: 'Notifications' , headerTitleAlign:"center"
          }}
      />
     
      
      </AppStack.Navigator>
    )
        }
}