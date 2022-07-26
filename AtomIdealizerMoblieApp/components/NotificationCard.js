import * as React from 'react';
import { View, Text,Image, Dimensions, ImageBackground, FlatList, VirtualizedList, TouchableOpacity } from 'react-native';
import feedStyles from '../styles/feedStyles';

export default function NotificationCard(props){

    const notification=props.notification
    console.log(notification,"notifiactios.......")
    return(<View style={{padding:20}}>
       <TouchableOpacity onPress={()=>{
   

  
    
    props.navigation.navigate("businessProfileScreen",{
    userId:"f1ZxYxelkMOanO7OJ0RHQSNqk4C2"
       })}}>  
      <View style={feedStyles.userInfo}>
                <Image   source={require('../assets/logo.png')}style={feedStyles.userImg}>

                </Image>
                <View style={{...feedStyles.userName,fontSize:40}}>

                    <Text style={feedStyles.userNameText}>
                        ShopMEdia
                    </Text>
                    <Text style={{marginRight:40}}>
                        {/* {notification.message} */}
                        Had a delicious meal at Burger Hut ? Rate for a streak
                    </Text>
                    <Text style={{fontWeight:"900"}}>Rate here</Text>
                </View>
             
                
                
                
            </View>  
            </TouchableOpacity>
    </View>)
}