import * as React from 'react';
import { View, Text,Image, Dimensions, ImageBackground, FlatList, VirtualizedList } from 'react-native';
import NotificationCard from '../components/NotificationCard';
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from './AuthContext';
export default function Notification({navigation}){
    const {user, logout} = React.useContext(AuthContext);

    const[notifications,setNotifications]=React.useState([])
    const[userData,setUserData]=React.useState(null)

React.useEffect(()=>{
getUser();
},[])
const getUser = async() => {
    const currentUser = await firestore()
    .collection('users')
    .doc(user.uid)
    .get()
    .then((documentSnapshot) => {
      if( documentSnapshot.exists ) {
        console.log('User Data', documentSnapshot.data());
        let data=documentSnapshot.data()
        setUserData(documentSnapshot.data());
       setNotifications(data.notification)
        console.log("userDAta",userData)
      }

    })
  }
    
    return(notifications?notifications.map((notification)=>(<NotificationCard navigation={navigation} notification={notification}/>)):<View><Text>Hi..........</Text></View>
        )
}