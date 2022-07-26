import * as React from 'react';
import { ImageBackground, View ,Text,Image, TextInput, Button, Touchable} from 'react-native';
import { SCREEN_HEIGHT } from '../utils/Dimensions';
import feedStyles from '../styles/feedStyles';
import MaterialIcon from 'react-native-vector-icons/Ionicons'
import { ScrollView } from 'react-native-gesture-handler';
import globalStyles from '../styles/globalStyles';
import { G } from 'react-native-svg';
import { Rating, AirbnbRating } from 'react-native-ratings';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
const POST = require("../assets/images/marina-abrosimova-_dcZHDd9puM-unsplash.jpg");
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from './AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import Moment from 'moment';
const PROFILE_PIC = require("../assets/images/fray-bekele-EuzwQ8sIpNY-unsplash.jpg");

export default function ProductScreen({route, navigation}){
    
    const {user, logout} = React.useContext(AuthContext);

    const [rating,setRating]=React.useState(0)
    const [userData,setUserData]=React.useState({})
    const [userReview,setUserReview]=React.useState({})
    const [editReview,setEditReview]=React.useState(false)
    const [reviews,setReviews]=React.useState([])

    const [globalRating,setGlobalRating]=React.useState(0);
    const[postX,setPostX]=React.useState({})
    const [review,setReview]=React.useState('')
    const {post}=route.params
    // console.log(post)
    React.useEffect(()=>{
console.log("triggred",post.id)

        
        getReviews();
        getPost();
       
    },[editReview])  
    React.useEffect(()=>{
      getUser();
    },[])
      React.useEffect(()=>{
        getPost();
        getReviews();
      },[review])
    
      const getPost = async () => {
        try {
         const list = [];
     
         await firestore()
           .collection('posts')
          .doc(post.id)
           .get()
           .then((documentSnapshot) => {
            if( documentSnapshot.exists ) {
              console.log('User Data', documentSnapshot.data());
              setPostX(documentSnapshot.data());
            }
            setPostX(documentSnapshot.data());

          })
     
     
         
     
         // console.log('Posts: ', posts);
       } catch (e) {
         console.log(e);
       }
       }
 const getReviews = async () => {
   try {
    const list = [];

    await firestore()
      .collection('reviews')
     .where('post','==',post.id)
      .get()
      .then((querySnapshot) => {
        console.log('Total revies: ', querySnapshot.size);

        querySnapshot.forEach((doc) => {
          const {
            userId,
           userImg,
            rating,
            review,
            userName,
            date
            
           
          } = doc.data();
          list.push({
            id: doc.id,
            userId,
        userName,
            userImg:userImg?userImg:  'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
            date,
           
            
            rating,
            review
     
          });
        });
        let   userReview=list.filter(function(value, index, arr){ 
            return value.userId==user.uid;
        });
let globalRatingSum=0
        for (let i=0;i<list.length;i++){
globalRatingSum=globalRatingSum+list[i].rating
        }
        setGlobalRating(globalRatingSum/list.length)
        console.log(userReview,list[0].date,"++++++++++++++++++++")
        setUserReview(userReview)
    
        setReviews(list);
      });


    

    // console.log('Posts: ', posts);
  } catch (e) {
    console.log(e);
  }
  }
    const getUser = async() => {
        const currentUser = await firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then((documentSnapshot) => {
          if( documentSnapshot.exists ) {
            // console.log('User Data', documentSnapshot.data());
            setUserData(documentSnapshot.data());
          }
        })
      }
    const submitReview = async () => {
        console.log(rating,review)
        setEditReview(false)
        firestore()
        .collection('reviews')
             . add({rating:rating,date:new Date().toISOString(), review:review,userId:userData.userId,userImg:userData.userImg,userName:userData.name,post:post.id})
  
  
        .then((res)=>{

          firestore()
          .collection('posts')
          .doc(post.id)
          .update({
            rating:((postX.rating*reviews.length)+rating)/(reviews.length+1),
            reviews:postX.reviews+1
          }).then(()=>{
            getReviews()
            getPost();
          })
            console.log(post.id)
            console.log(res)
         
        })
    

      }

    const updateReview = async () => {
        setEditReview(false)
        console.log(rating,review)

        firestore()
        .collection('reviews')
        .doc(userReview[0].id)
             . update({rating: rating,date:new Date().toISOString(), review:review,userId:userData.userId,userImg:userData.userImg,userName:userData.name,post:post.id}
            )
  
  
        .then((res)=>{
          console.log(postX.rating,"post Rating ",userReview[0].rating,rating,reviews.length)
          firestore()
          .collection('posts')
          .doc(post.id)
          .update({
            rating:((postX.rating*reviews.length)-userReview[0].rating+rating)/(reviews.length)
            

          }).then(()=>{
            getPost()
          })
            console.log(post.id)
            console.log(res)

        })
    }
   function ratingCompleted(rating) {
setRating(rating)
        console.log("Rating is: " + rating)
      }
    
    // console.log("params",post)
    return(
       

            <View style={{backgroundColor:'white'}}>
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
    <Rating
    type="custom"
 style={{backgroundColor:'transparent'}}
 ratingBackgroundColor={'transparent'}
  ratingCount={5}
  readonly={true}
startingValue={postX?postX.rating:0}
  imageSize={30}
//   showRating
  onFinishRating={ratingCompleted}
/>
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
<Text style={globalStyles.heading}>
 Your Review
</Text>
    {userReview[0] && !editReview?  <View style={{marginVertical:20}}>
         <View style={feedStyles.userInfo}>
                <Image source={{uri:userReview[0].userImg}} style={feedStyles.userImg}>

                </Image>
                <View style={feedStyles.userName}>
                    <Text style={feedStyles.userNameText}>
                        {userReview[0].name}
                    </Text>

                </View>
                
                
                
            </View> 
            <View style={{flexDirection:'row'}}>
            <Rating
 style={{backgroundColor:'white',marginVertical:10}}
  ratingCount={5}
startingValue={userReview[0].rating}
  imageSize={20}
  readonly={true}
//   showRating
  onFinishRating={ratingCompleted}
/>
        <View >
        <Text style={{color:'black',marginLeft:5,marginVertical:10}}>
           12/3/2022
        </Text>

    </View>
 
    </View> 
  
    <Text>
   {userReview[0].review}
    </Text>
    <TouchableOpacity onPress={()=>{
        setEditReview(true)
    }}>
    <Text style={{marginVertical:10,color:'#0077B5'}}>Edit Your Review</Text>
    </TouchableOpacity>
    </View> :<>
<Rating
 style={{backgroundColor:'white'}}
  ratingCount={5}
startingValue={0}
  imageSize={60}
  showRating
  onFinishRating={ratingCompleted}
/>

<TextInput onChangeText={setReview} placeholder='Write your Review' style={{borderColor:'black',borderWidth:0.5,marginVertical:10}} multiline={true}>

</TextInput>
{ editReview?<TouchableOpacity onPress={()=>updateReview()}>
<Text style={{alignSelf:'flex-end',color:'#0804f9'}} >UPDATE</Text>

</TouchableOpacity>: <TouchableOpacity onPress={()=>submitReview()}>
<Text style={{alignSelf:'flex-end',color:'#0804f9'}} >POST</Text>

</TouchableOpacity>}
</>}
{/* 
<>
<Rating
 style={{backgroundColor:'white'}}
  ratingCount={5}
startingValue={0}
  imageSize={60}
  showRating
  onFinishRating={ratingCompleted}
/>

<TextInput onChangeText={setReview} placeholder='Write your Review' style={{borderColor:'black',borderWidth:0.5,marginVertical:10}} multiline={true}>

</TextInput>
<TouchableOpacity onPress={()=>submitReview()}>
<Text style={{alignSelf:'flex-end',color:'#0804f9'}} >POST</Text>

</TouchableOpacity>
</> */}
     <View style={{marginVertical:10}}> 
<Text style={globalStyles.heading}>
    Rating and Reviews 
</Text>
         </View>
         {reviews?reviews.map((item)=>(
             <View style={{marginVertical:20}}>
             <View style={feedStyles.userInfo}>
                    <Image source={{uri:item.userImg}} style={feedStyles.userImg}>
    
                    </Image>
                    <View style={feedStyles.userName}>
                        <Text style={feedStyles.userNameText}>
                            {item.userName}
                        </Text>
    
                    </View>
                    
                    
                    
                </View> 
                <View style={{flexDirection:'row'}}>
                <Rating
     style={{backgroundColor:'white',marginVertical:10}}
      ratingCount={5}
    startingValue={item.rating}
      imageSize={20}
      readonly={true}
    //   showRating
      onFinishRating={ratingCompleted}           
    />
            <View >
            <Text style={{marginLeft:5,marginVertical:10}}>
            {/* { JSON.stringify( item.date)} */}
            {item.date.slice(0,10)}
            </Text>
    
        </View>
     
        </View> 
      
        <Text>
       {item.review}
        </Text>
       
        </View>
         )):null}
     
    </View>  
         </ScrollView>
            </View>
      
    )
}