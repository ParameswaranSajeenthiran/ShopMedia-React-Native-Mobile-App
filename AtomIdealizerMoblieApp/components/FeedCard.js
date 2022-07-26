import * as React from 'react';
import { View, Text,Image, Dimensions, ImageBackground, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import NOTIFICATION from '../assets/icons/home.svg'
import { AuthContext } from '../screens/AuthContext';
import MaterialIcon from 'react-native-vector-icons/Ionicons'
const LOGO_IMAGE = require("../assets/icons/home.png");
const windowWidth=Dimensions.get('screen').width;
const windowHeight=Dimensions.get('screen').height;
const PROFILE_PIC = require("../assets/images/fray-bekele-EuzwQ8sIpNY-unsplash.jpg");
const POST = require("../assets/images/marina-abrosimova-_dcZHDd9puM-unsplash.jpg");
import feedStyles from '../styles/feedStyles';
// import StarRating from 'react-native-star-rating';
import LinearGradient   from 'react-native-linear-gradient';
import { Rating } from 'react-native-ratings';

export default function FeedCard(props) {
  const {user,logout}=React.useContext(AuthContext)

    let item=props.item
    return (
        <View onPress={()=>props.navigation.navigate("Product")}>
        <View  style={feedStyles.card}>     
        <TouchableOpacity onPress={()=>{
    if(user.uid==item.userId){
    props.  navigation.navigate("ProfileScreen")
    }else{
    
    props.navigation.navigate("businessProfileScreen",{
    userId:item.userId
  })}}}>    
           <View style={feedStyles.userInfo}>
                <Image source={item.userImg?{uri:item.userImg}:require('../assets/logo.png')} style={feedStyles.userImg}>

                </Image>
                <View style={feedStyles.userName}>
                    <Text style={feedStyles.userNameText}>
                        {item?item.userName:null}
                    </Text>

                </View>
                
                
                
            </View>   
            </TouchableOpacity>
            <ImageBackground
         borderRadius={50}
    style={{width : windowWidth-20, height: windowHeight*0.5,borderRadius:50}}
    source={{uri:item?item.postImg:null}}> 
     {/* <LinearGradient 
    colors={['#00000000', '#6D6B6B']} 
    style={{height : '100%', width : '100%'}}>



</LinearGradient> */}

  <View style={feedStyles.detail}>   
  <TouchableOpacity  onPress={()=>props.navigation.navigate("Product",{
    post:item
  })} style={{backgroundColor:'white' ,width:120,height:50,alignSelf:'flex-end',top:10,right:20,borderRadius:10, alignItems:'center',justifyContent:'center'}}>
    <Text style={{fontWeight:'bold',color:'black'}}>View Reviews</Text>
    </TouchableOpacity>     
   <View style={{position:'relative',top:250,marginHorizontal:10}}>
    <Text style={{...feedStyles.heading}}>{item?item.title:null}</Text>
    <Text style={{...feedStyles.heading,fontSize:16}}>{item?item.description:null}</Text>
    {/* <Text style={{...feedStyles.heading,fontSize:16}}>Rs .{item?item.price:null}</Text> */}
  
    <View style={feedStyles.rating}>
    <Rating
    type="custom"
 style={{backgroundColor:'transparent'}}
 ratingBackgroundColor={'white'}
  ratingCount={5}
  readonly={true}
startingValue={item?item.rating:null}
  imageSize={30}
//   showRating
//   onFinishRating={ratingCompleted}
/>
        <View style={{left:120}}>
        <Text style={feedStyles.description}>
            {item?item.review?item.review+"reviews":null:null} 
        </Text>
    </View>
    </View>
   </View>
  
   

    </View>
</ImageBackground>  
        </View>
        </View>

    );
}