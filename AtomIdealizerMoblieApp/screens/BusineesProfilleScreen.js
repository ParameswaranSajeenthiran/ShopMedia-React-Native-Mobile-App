import * as React from 'react';
import { View, Text, ImageBackground, Image, ScrollView } from 'react-native';
import feedStyles from '../styles/feedStyles';
import globalStyles from '../styles/globalStyles';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../utils/Dimensions';
import { AuthContext } from './AuthContext';
import firestore from '@react-native-firebase/firestore'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AirbnbRating, Rating } from 'react-native-ratings';
const POST = require("../assets/images/marina-abrosimova-_dcZHDd9puM-unsplash.jpg");
const PROFILE_PIC = require("../assets/images/fray-bekele-EuzwQ8sIpNY-unsplash.jpg");

export default function BusinessProfileScreen({route, navigation }) {

    const {user, logout} = React.useContext(AuthContext);

    const [posts, setPosts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [deleted, setDeleted] = React.useState(false);
    const [userData, setUserData] = React.useState({});
    const[update,setUpdate]=React.useState(true)
    const{userId}=route.params

    React.useEffect(() => {
      
        fetchPosts();
        getUser();
        navigation.addListener("focus", () => setLoading(!loading));
      }, [navigation, update]);

      const follow = async() => {
        if(userData.followers.includes(user.uid)){
          firestore()
      .collection('users'). 
      doc(userData.userId).   
      update({followers:firestore.FieldValue.arrayRemove(user.uid)})

      firestore()
      .collection('users'). 
      doc(user.uid).   
      update({following:firestore.FieldValue.arrayRemove(userId)})


        }
        else{
      firestore()
      .collection('users'). 
      doc(userData.userId).   
      update({followers:firestore.FieldValue.arrayUnion(user.uid)})

      firestore()
      .collection('users'). 
      doc(user.uid).   
      update({following:firestore.FieldValue.arrayUnion(userId)})

      }
    
    setUpdate(!update)}
        const getUser = async() => {
    const currentUser = await firestore()
    .collection('users')
    .doc(userId)
    .get()
    .then((documentSnapshot) => {
      if( documentSnapshot.exists ) {
        console.log('User Data', documentSnapshot.data());
        setUserData(documentSnapshot.data());
      }
    })
  }
    const fetchPosts = async () => {
        try {
          const list = [];
    
          await firestore()
            .collection('posts')
            .where('userId', '==',userId)
            .orderBy('postTime', 'desc')
            .get()
            .then((querySnapshot) => {
              // console.log('Total Posts: ', querySnapshot.size);
    
              querySnapshot.forEach((doc) => {
                const {
                  userId,
                  post,
                  postImg,
                  postTime,
                  likes,
                  comments,
                } = doc.data();
                list.push({
                  id: doc.id,
                  userId,
                  userName: 'Test Name',
                  userImg:
                    'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
                  postTime: postTime,
                  post,
                  postImg,
                  liked: false,
                  likes,
                  comments,
                });
              });
            });
    
          setPosts(list);
     
          firestore()
          .collection('users')    
          .doc(user.uid).update({
postImgs:list.map(item=>({id:item.id,img:item.postImg}))

          })
          if (loading) {
            setLoading(false);
          }
    
          console.log('Posts: ', posts);
        } catch (e) {
          console.log(e);
        }
      };
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start',alignContent:'flex-start',backgroundColor:'white' }}>
            <ScrollView>
            <ImageBackground source={{uri: userData?userData.backgroundImgUrl:""}} style={{width:SCREEN_WIDTH,height:SCREEN_HEIGHT*0.2}}>
            <Image source={{uri: userData?userData.userImg:""}} borderRadius={100} style={{width:150,height:150,alignSelf:'center',justifyContent:'flex-end',top:100, borderWidth:5,borderColor:'white'}}/>

            </ImageBackground>
<View style={{marginTop:60,alignItems:'center',padding:10}}>
            <Text style={{fontSize:24,color:'black',fontWeight:'bold'}}>
{userData?userData.name:""}
            </Text>
            <Text>
            { userData?userData.description:""}
            </Text>
            <View style={{flexDirection:'row',marginTop:20}}>
              <TouchableOpacity onPress={()=>follow()}>
            <View  style={{marginHorizontal:5,marginVertical:5, width:SCREEN_WIDTH*0.4,backgroundColor:"#0077B5",height:SCREEN_HEIGHT*0.04,borderRadius:10,alignItems:'center',justifyContent:'center'}}>
                <Text style={feedStyles.description}>
                  {userData.followers?userData.followers.includes(user.uid)?"UnFollow":"follow":null}
                </Text>

            </View>
            </TouchableOpacity>
            
          
            </View>
            <AirbnbRating
 style={{backgroundColor:'white',marginVertical:10}}
 reviews={[ "Terrible","Bad","Good", "Very Good", "Awesome"]}
defaultRating={0}
  // ratingCount={5}
startingValue={0}
  imageSize={60}
  // readonly={true}
  showRating
  // onFinishRating={ratingCompleted}
/>
            <View style={{flexDirection:'row',marginVertical:20}}>
<View style={{marginHorizontal:10}}>
<Text style={{...globalStyles.heading,alignSelf:'center'}}>
       {posts.length}
    </Text>
    <Text>
        POSTS
    </Text>
</View>

<View style={{marginHorizontal:30}}>
<Text style={{...globalStyles.heading,alignSelf:'center'}}>
       {userData.following?userData.following.length:0}
    </Text>
    <Text>
FOLLOWING    </Text>
</View>
<View style={{marginHorizontal:10}}>
<Text style={{...globalStyles.heading,alignSelf:'center'}}>
        {userData.followers?userData.followers.length:0}
    </Text>
    <Text>
        Customers
    </Text>
</View>
            </View>
            </View>
            <View style={{flexDirection:'row',width:SCREEN_WIDTH,justifyContent:'flex-start',flexWrap:"wrap"}} >
                {posts.map((item,index) => (
             <TouchableOpacity onPress={() => navigation.navigate("BusinessFeedScreen", { userId:item.userId,index:index })}>
             <View >
               <Image source={{ uri: item.postImg }} style={{ width: SCREEN_WIDTH / 3, height: SCREEN_HEIGHT * 0.2 }} />
             </View>
           </TouchableOpacity>   
        ))}
 </View>
           
            </ScrollView>
        </View>
    );
}