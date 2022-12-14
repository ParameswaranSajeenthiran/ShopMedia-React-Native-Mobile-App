import * as React from 'react';
import { View, Text,Image, Dimensions, ImageBackground, FlatList, VirtualizedList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TouchableOpacity } from 'react-native-gesture-handler';
import NOTIFICATION from '../assets/icons/home.svg'
import { AuthContext } from './AuthContext';
import MaterialIcon from 'react-native-vector-icons/Ionicons'
const LOGO_IMAGE = require("../assets/icons/home.png");
const windowWidth=Dimensions.get('screen').width;
const windowHeight=Dimensions.get('screen').height;
const PROFILE_PIC = require("../assets/images/fray-bekele-EuzwQ8sIpNY-unsplash.jpg");
const POST = require("../assets/images/marina-abrosimova-_dcZHDd9puM-unsplash.jpg");
import feedStyles from '../styles/feedStyles';
// import StarRating from 'react-native-star-rating';
import LinearGradient   from 'react-native-linear-gradient';
import FeedCard from '../components/FeedCard';
import { FloatingAction } from "react-native-floating-action";
import firestore from '@react-native-firebase/firestore'
import ImagePicker from 'react-native-image-crop-picker';
import PushNotification, {Importance} from 'react-native-push-notification';
import GetLocation from 'react-native-get-location'
import { useFocusEffect } from '@react-navigation/native';
const userCollection = firestore().collection('posts');
import messaging from '@react-native-firebase/messaging';

export default function FeedScreen({ navigation }) {
  const {user, logout} = React.useContext(AuthContext);

      const actions = [
        {
           
            icon:<MaterialIcon name="camera" size={48}/>,
            name: "takePhotoFromCamera",
            position: 4,
            color:"white",
            buttonSize:60,
            text:"Take Photo"
          
          },
      
        {
          
          icon:<MaterialIcon name="image" size={48}/>,
          name: "choosePhotoFromLibrary",
          position: 4,
          color:"white",
          buttonSize:60,
          text:"Chose From Gallery"
          
        
        }
      ];

      const [posts, setPosts] = React.useState([]);
      const [loading, setLoading] = React.useState(true);
      const [userLocation,setUserLocation]=React.useState(null)
      const [update, setUpdate] = React.useState(true);
      const[itemsCount,setItemsCount]=React.useState(2);
      const [index,setIndex]=React.useState(0)
      const [tempArray,setTempArray]=React.useState([ ])
      const [lastDocument, setLastDocument] =React. useState();
      const[userData,setUserData]=React.useState(null)
     React. useEffect(() => {
        // Assume a message-notification contains a "type" property in the data payload of the screen to open
    
       getUser()
        },[]);
    
        // Check whether an initial notification is available
       
const handlePushNotification=()=>{
PushNotification.localNotification({
  message: "My Notification Message", // (required)
  date: new Date(Date.now() + 60 * 1000), // in 60 secs
  allowWhileIdle: false, //
  channelId:'channel-id'
})
}



   async function getReviews (id)  {
        try {
         const list = [];
     
         await firestore()
           .collection('reviews')
          .where('post','==',id)
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
             
     let globalRatingSum=0
             for (let i=0;i<list.length;i++){
     globalRatingSum=globalRatingSum+list[i].rating
    //  console.log(list[i].rating)
             }
            
            //  console.log(userReview,list[0].date,"++++++++++++++++++++")
            let reviews= [{rating:globalRatingSum/list.length,reviews:list.length}]
            //  console.log(reviews)
         return globalRatingSum
           });
     
     
         
  
         // console.log('Posts: ', posts);
       } catch (e) {
         console.log(e);
       }
       }
      const takePhotoFromCamera = () => {

        ImagePicker.openCamera({
          width: 1200,
          height: 780,
          cropping: false,
        }).then((image) => {
          console.log(image);
          const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
          // setImage(image.path);
            navigation.navigate("addPost",{
              imageUri:imageUri
            })
        });
      };
    
      const choosePhotoFromLibrary = () => {
        ImagePicker.openPicker({
          width: 1200,
          height: 780,
          cropping: false,
        }).then((image) => {
          console.log(image);
          const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
          // setImage(image.path);
          console.log(image)
          navigation.navigate("addPost",{
            imageUri:imageUri
          })

        });
      };
      function onEndReached(){
        // if(index!=posts.length){
// setTempArray([...tempArray,posts[index]])
// tempArray.shift()

// setIndex(index+1)}
fetchPosts(userLocation)
        
        }
      function onStartReached(){
        setTempArray([...tempArray,posts[index]])
        setIndex(index-1)
      }
      const fetchPosts = async (userLocation) => {
        try {
          const list = [];
         
          let query = userCollection
            .orderBy('rating', 'desc')

            if (lastDocument !== undefined) {
              query = query.startAfter(lastDocument); // fetch data following the last document accessed
            }
            query.limit(1).get()
            .then((querySnapshot) => {
              console.log('Total Posts: ', querySnapshot.size);
              console.log(lastDocument,"___________________")
              setLastDocument(querySnapshot.docs[querySnapshot.docs.length - 1]);
          
              querySnapshot.forEach((doc) => {
                const {
                  userId,
                  title,
                  description,
                  location,
                  userImg,
                  userName,
                  postImg,
                  postTime,
                  price,
                  rating,
                  review
                 
                } = doc.data();
                setIndex(0)
                console.log(location,userLocation)
                if(location.longitude<=userLocation.longitude+ 0.46421 && location.longitude>=userLocation.longitude- 0.4621 &&location.latitude<=userLocation.latitude+ 0.66421&& location.latitude>=userLocation.latitude- 0.6621 ){

                 list.push({
                  id: doc.id,
                  userId,
                  userName:userName?userName: 'Test Name',
                  userImg:userImg?userImg:
                    'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
                  postTime: postTime,
                  title,
                  postImg,
                  liked: false,
                  rating,
                  review,
             
                
                  description,
                  price
              
                }); if(posts.length!=0){
                  setPosts(oldArray => [...oldArray,{
                    id: doc.id,
                    userId,
                    userName:userName?userName: 'Test Name',
                    userImg:userImg?userImg:
                      'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
                    postTime: postTime,
                    title,
                    postImg,
                    liked: false,
                    rating,
                    review,
               
                  
                    description,
                    price
                
                  }]);
            }// setTempArray(list.splice(0,2))
            
            else{
              setPosts(list)}
              }
               
              });
              
            });
   
          if (loading) {
            setLoading(false);
          }
    
          console.log('Posts: ', posts);
        } catch (e) {
          console.log(e);
        }
      };  
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
      useFocusEffect(
        React.useCallback(() => {
         
    
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
      .then(location => {
        console.log(location);
        // setUserData({...userData,location:{latitude:location.latitude,longitude:location.longitude}})
        setUserLocation({latitude:location.latitude,longitude:location.longitude})
        fetchPosts(location);
      })
      .catch(error => { 
        const { code, message } = error;
        console.warn(code, message);
      })
      
  }, [navigation]))

  // React.useEffect(() => {
  //   fetchPosts();
      
  //   const subscriber = firestore()
  //     .collection('posts')
  //       .onSnapshot(documentSnapshot => {
  //      fetchPosts()

  //     });
   


  //   // Stop listening for updates when no longer required
  //   // return () => subscriber();
  // }, []);

  const getItemCount = (data) => itemsCount;
  const getItem = (data, index) => (
    data[index]
  );
    const renderItem = ({ item }) => (
        <FeedCard item={item}
        navigation={navigation} />
      );
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' ,backgroundColor:'white'}}>
     
    
       {posts?<VirtualizedList
keyExtractor={item => item}
getItemCount={data => data.length}
getItem={getItem}

        // showsVerticalScrollIndicator={false}
        data={posts}
        onEndReached={onEndReached}
        // onScrollToTop={onStartReached}
        renderItem={renderItem}
        // keyExtractor={item => item.id}
      />:null}   
        {/* <FeedCard/> */}
       
        {userData ? userData.category ? <FloatingAction


actions={actions}

onPressItem={name => {

  if (name == "choosePhotoFromLibrary") {
    choosePhotoFromLibrary()
  } else {
    takePhotoFromCamera()
  };

  console.log(`selected button: ${name}`);
}}
/>:null:null}     
        </View>
    );
}