import * as React from 'react';
import { View, Text, ImageBackground, Image, ScrollView ,TouchableOpacity} from 'react-native';
import feedStyles from '../styles/feedStyles';
import globalStyles from '../styles/globalStyles';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../utils/Dimensions';
import { AuthContext } from './AuthContext';
import firestore from '@react-native-firebase/firestore'
import { useFocusEffect } from '@react-navigation/native';
const POST = require("../assets/images/marina-abrosimova-_dcZHDd9puM-unsplash.jpg");
const PROFILE_PIC = require("../assets/images/fray-bekele-EuzwQ8sIpNY-unsplash.jpg");

export default function ProfileScreen({route, navigation }) {

    const {user, logout} = React.useContext(AuthContext);

    const [posts, setPosts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [deleted, setDeleted] = React.useState(false);
    const [userData, setUserData] = React.useState(null);
  
    useFocusEffect(
      React.useCallback(() => {     getUser();
        fetchPosts();
        navigation.addListener("focus", () => setLoading(!loading)); },[]))
      //   React.useEffect(() => {
      // getUser();
      //   fetchPosts();
      //   navigation.addListener("focus", () => setLoading(!loading));
      // }, [navigation]);

      const getUser = async() => {
        const currentUser = await firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then((documentSnapshot) => {
          console.log(user.uid)
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
            .where('userId', '==', user.uid)
            .orderBy('postTime', 'desc').limit(6)
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
{userData?userData.name:null}
            </Text>
            <Text>
{userData?userData.description:null}
            </Text>
            <View style={{flexDirection:'row',marginTop:20}}>
              <TouchableOpacity onPress={()=>logout()}>
            <View  style={{marginHorizontal:5,marginVertical:5, width:SCREEN_WIDTH*0.4,backgroundColor:"#0077B5",height:SCREEN_HEIGHT*0.04,borderRadius:10,alignItems:'center',justifyContent:'center'}}>
                <Text style={feedStyles.description}>
                    logout
                </Text>

            </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate("editProfile",{
              initialUserData:userData
            })}>
            <View style={{marginHorizontal:5,marginVertical:5, width:SCREEN_WIDTH*0.4,backgroundColor:"#86888A",height:SCREEN_HEIGHT*0.04,borderRadius:10,alignItems:'center',justifyContent:'center'}}>
            <Text style={{...feedStyles.description,color:'black'}}>
               Analyze
            </Text>
            </View>
            </TouchableOpacity>
            </View>
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
{userData?userData.following.length:0}

    </Text>
    <Text>
FOLLOWING    </Text>
</View>
<View style={{marginHorizontal:10}}>
<Text style={{...globalStyles.heading,alignSelf:'center'}}>
{userData?userData.followers.length:0}    </Text>
    <Text>
        Customers
    </Text>
</View>
            </View>
            </View>
            <View style={{flexDirection:'row',width:SCREEN_WIDTH,justifyContent:'flex-start',flexWrap:"wrap"}} >
                {posts.map((item,index) => (
                  <TouchableOpacity onPress={() => navigation.navigate("BusinessFeedScreen", { userId: user.uid,index:index })}>
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