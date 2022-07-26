import * as React from 'react';
import { View, Text,Image, Dimensions, ImageBackground, FlatList } from 'react-native';

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

import GetLocation from 'react-native-get-location'


export default function BusinessFeedScreen({route, navigation }) {
    const DATA = [
        {
          id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
          title: 'First Item',
        },
        {
          id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
          title: 'Second Item',
        },
        {
          id: '58694a0f-3da1-471f-bd96-145571e29d72',
          title: 'Third Item',
        },
      ];
      const actions = [
        {
           
            icon:<MaterialIcon name="photo" size={48}/>,
            name: "takePhotoFromCamera",
            position: 4,
            color:"white",
          
          },
      
        {
          
          icon:<MaterialIcon name="camera" size={48}/>,
          name: "choosePhotoFromLibrary",
          position: 4,
          color:"white",
        
        }
      ];

      const [posts, setPosts] = React.useState(null);
      const [loading, setLoading] = React.useState(true);
      const [location,setLocation]=React.useState({})
      const{userId}=route.params


   async function getReviews (id)  {
        try {
         const list = [];
     
         await firestore()
           .collection('reviews')
          .where('post','==',id).limit(6)
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
      const fetchPosts = async () => {
        try {
          const list = [];
    
          await firestore()
            .collection('posts')
           .where("userId","==",userId)
            .get()
            .then((querySnapshot) => {
              console.log('Total Posts: ', querySnapshot.size);
    
              querySnapshot.forEach((doc) => {
                const {
                  userId,
                  title,
                  description,
                  
                  
                  postImg,
                  postTime,
                  price,
                  rating,
                  review
                 
                } = doc.data();

                 list.push({
                  id: doc.id,
                  userId,
                  userName: 'Test Name',
                  userImg:
                    'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
                  postTime: postTime,
                  title,
                  postImg,
                  liked: false,
                  rating,
                  review,
             
                
                  description,
                  price
              
                });

               
              });
            });
    
          setPosts(list);
    
          if (loading) {
            setLoading(false);
          }
    
          console.log('Posts: ', posts);
        } catch (e) {
          console.log(e);
        }
      };    
  React.useEffect(() => {
    fetchPosts();
    
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
      .then(location => {
        console.log(location);
        // setUserData({...userData,location:{latitude:location.latitude,longitude:location.longitude}})
        setLocation({latitude:location.latitude,longitude:location.longitude})
      
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      })
    
  }, []);
    const renderItem = ({ item }) => (
        <FeedCard item={item}
        navigation={navigation} />
      );
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' ,backgroundColor:'white'}}>
          <FlatList
        showsVerticalScrollIndicator={false}
        data={posts}
        renderItem={renderItem}
        // keyExtractor={item => item.id}
      />
        {/* <FeedCard/> */}
       
        <FloatingAction
      
        
    actions={actions}
    
    onPressItem={name => {

      if(name=="choosePhotoFromLibrary"){
        choosePhotoFromLibrary()
      }else{
        takePhotoFromCamera()
      };
      
      console.log(`selected button: ${name}`);
    }}
  />
        </View>
    );
}