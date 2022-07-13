import * as React from 'react';
import { ImageBackground, View ,Text,Image} from 'react-native';
import { SCREEN_HEIGHT } from '../utils/Dimensions';
import feedStyles from '../styles/feedStyles';
import MaterialIcon from 'react-native-vector-icons/Ionicons'
import { ScrollView } from 'react-native-gesture-handler';
import globalStyles from '../styles/globalStyles';
import { G } from 'react-native-svg';

const POST = require("../assets/images/marina-abrosimova-_dcZHDd9puM-unsplash.jpg");

const PROFILE_PIC = require("../assets/images/fray-bekele-EuzwQ8sIpNY-unsplash.jpg");

export default function ProductScreen({route, navigation}){

    const {post}=route.params
    console.log("params",post)
    return(
       

            <View style={{}}>
                <ScrollView>
            <ImageBackground
  
                    style={{ width: '100%', height: SCREEN_HEIGHT * 0.5 }}
                    source={{uri:post.postImg}}>
         <View style={feedStyles.detail}>        
   <View style={{position:'relative',top:300,marginHorizontal:10}}>
    <Text style={{...feedStyles.heading}}>{post.title}</Text>
    <Text style={{...feedStyles.heading,fontSize:16}}>{post.description}</Text>
    <Text style={{...feedStyles.heading,fontSize:16}}>Rs .{post.price}</Text>
  
    <View style={feedStyles.rating}>
        <MaterialIcon name="star" size={24}  color="white"/>
        <MaterialIcon name="star" size={24}  color="white"/>
        <MaterialIcon name="star" size={24}  color="white"/>
        <MaterialIcon name="star" size={24}  color="white"/>
        <MaterialIcon name="star" size={24}  color="white"/>
        <View style={{left:140}}>
        <Text style={feedStyles.description}>
            24k+ reviews
        </Text>
    </View>
    </View>
   </View>
   
   

    </View>
         </ImageBackground>
<View style={{marginHorizontal:10}}>
         <View style={{marginVertical:10}}> 
<Text style={globalStyles.heading}>
    Rating and Reviews 
</Text>
         </View>
       <View style={{marginVertical:20}}>
         <View style={feedStyles.userInfo}>
                <Image source={PROFILE_PIC} style={feedStyles.userImg}>

                </Image>
                <View style={feedStyles.userName}>
                    <Text style={feedStyles.userNameText}>
                        House of Fashion 
                    </Text>

                </View>
                
                
                
            </View> 
            <View style={{flexDirection:'row'}}>
        <MaterialIcon name="star" size={24}  color="gold"/>
        <MaterialIcon name="star" size={24}  color="gold"/>
        <MaterialIcon name="star" size={24}  color="black"/>
        <MaterialIcon name="star" size={24}  color="black"/>
        <View >
        <Text style={{color:'black',marginLeft:5}}>
           12/3/2022
        </Text>

    </View>
 
    </View> 
  
    <Text>
    Had concerns that this would be too long, and couldn't easily be shortened due to trim, but the size 10 put the trim right at my knees (I'm 5'1 1/2"). Fits well, even through bust, which is usually too tight in a size 10. Gorgeous color and very flattering. If any are left, get one before they're gone.
Toni3926, CA
    </Text>
    </View> 
    <View style={{marginVertical:20}}>
         <View style={feedStyles.userInfo}>
                <Image source={PROFILE_PIC} style={feedStyles.userImg}>

                </Image>
                <View style={feedStyles.userName}>
                    <Text style={feedStyles.userNameText}>
                        House of Fashion 
                    </Text>

                </View>
                
                
                
            </View> 
            <View style={{flexDirection:'row'}}>
        <MaterialIcon name="star" size={24}  color="gold"/>
        <MaterialIcon name="star" size={24}  color="gold"/>
        <MaterialIcon name="star" size={24}  color="black"/>
        <MaterialIcon name="star" size={24}  color="black"/>
        <View >
        <Text style={{color:'black',marginLeft:5}}>
           12/3/2022
        </Text>

    </View>
 
    </View> 
  
    <Text>
    Had concerns that this would be too long, and couldn't easily be shortened due to trim, but the size 10 put the trim right at my knees (I'm 5'1 1/2"). Fits well, even through bust, which is usually too tight in a size 10. Gorgeous color and very flattering. If any are left, get one before they're gone.
Toni3926, CA
    </Text>
    </View> 
    <View style={{marginVertical:20}}>
         <View style={feedStyles.userInfo}>
                <Image source={PROFILE_PIC} style={feedStyles.userImg}>

                </Image>
                <View style={feedStyles.userName}>
                    <Text style={feedStyles.userNameText}>
                        House of Fashion 
                    </Text>

                </View>
                
                
                
            </View> 
            <View style={{flexDirection:'row'}}>
        <MaterialIcon name="star" size={24}  color="gold"/>
        <MaterialIcon name="star" size={24}  color="gold"/>
        <MaterialIcon name="star" size={24}  color="black"/>
        <MaterialIcon name="star" size={24}  color="black"/>
        <View >
        <Text style={{color:'black',marginLeft:5}}>
           12/3/2022
        </Text>

    </View>
 
    </View> 
  
    <Text>
    Had concerns that this would be too long, and couldn't easily be shortened due to trim, but the size 10 put the trim right at my knees (I'm 5'1 1/2"). Fits well, even through bust, which is usually too tight in a size 10. Gorgeous color and very flattering. If any are left, get one before they're gone.
Toni3926, CA
    </Text>
    </View> 
    </View>  
         </ScrollView>
            </View>
      
    )
}