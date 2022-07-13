import * as React from 'react';
import { ActivityIndicator, Image, ImageBackground, Platform, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import feedStyles from '../styles/feedStyles';
const PROFILE_PIC = require("../assets/images/fray-bekele-EuzwQ8sIpNY-unsplash.jpg");
import ImagePicker from 'react-native-image-crop-picker';
import { FloatingAction } from "react-native-floating-action";
import MaterialIcon from 'react-native-vector-icons/Ionicons'
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../utils/Dimensions';
import { AuthContext } from './AuthContext';
export default function AddPostScreen({route,navigation}){
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

      const [image,setImage]=React.useState(null);
      const [title,setTitle]=React.useState("");
      const [description,setDescription]=React.useState("")
      const [price,setPrice]=React.useState(null)

      const [uploading, setUploading] = React.useState(false);
      const [transferred, setTransferred] =React.useState(0);
      const [post, setPost] =React.useState(null);

      const {user, logout} = React.useContext(AuthContext);

React.useEffect(()=>{
const {action,imageUri}=route.params
setImage(imageUri)

},[])
    const takePhotoFromCamera = () => {

        ImagePicker.openCamera({
          width: 1200,
          height: 780,
          cropping: false,
        }).then((image) => {
          console.log(image);
          const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
          setImage(image.path);

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
          setImage(image.path);
          console.log(image)

        });
      };
      
  const submitPost = async () => {
    const imageUrl = await uploadImage();
    console.log('Image Url: ', imageUrl);
    console.log('Post: ', post);

    firestore()
    .collection('posts')
    .add({
      userId: user.uid,
      title: title,
      description:description,
      price:price,
      postImg: imageUrl,
      postTime: firestore.Timestamp.fromDate(new Date()),
      rating: null,
      reviews: null,
    })
    .then(() => {
      console.log('Post Added!');
      Alert.alert(
        'Post published!',
        'Your post has been published Successfully!',
      );
      setPost(null);
    })
    .catch((error) => {
      console.log('Something went wrong with added post to firestore.', error);
    });
  }

  const uploadImage = async () => {
    if( image == null ) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop(); 
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    // Set transferred state
    task.on('state_changed', (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setUploading(false);
      setImage(null);

      // Alert.alert(
      //   'Image uploaded!',
      //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
      // );
      return url;

    } catch (e) {
      console.log(e);
      return null;
    }

  };
    
return(
    <View style={{ flex: 1,backgroundColor:'white'}}>
        <View >
    <View style={feedStyles.userInfo}>
      
        {/* <View> {image != null ? <Image source={{uri: image}} /> : null}        </View> */}
                <Image source={PROFILE_PIC} style={feedStyles.userImg}>

                </Image>
                <View style={feedStyles.userName}>
                    <Text style={feedStyles.userNameText}>
                        House of Fashion 
                    </Text>

                </View>
                
                
                
            </View> 
          
          

            </View>  
          <View >
            <ImageBackground  borderRadius={50} source={{uri:image}} style={{ width:SCREEN_WIDTH,height:SCREEN_HEIGHT*0.45,alignSelf:'center'}}>
            <View style={{top:250,marginHorizontal:10,maxHeight:100,flexDirection:'column'}}>
            <TextInput  onChangeText={setTitle} style={{fontSize:48,...feedStyles.heading}} placeholderTextColor="white"  placeholder='GIve Your Product A Title'/>
                      
                      <TextInput onChangeText={setDescription}   style={{fontSize:24}} placeholder='Descibe aboout Your Product'/>
                      <TextInput onChangeText={setPrice} keyboardType='numeric' style={{fontSize:24}} placeholder='Descibe aboout Your Product'/>
                      </View>
           </ImageBackground>
         
           </View>
           < View >
   <TouchableOpacity  onPress={()=>submitPost()} >  
   <View>
    <Text >post</Text>
    <View>
  {uploading?<ActivityIndicator />:null }    
    </View>
    </View>
     </TouchableOpacity>
                      </View>
            <FloatingAction
      
        
      actions={actions}
      onPressItem={name => {
      if(name=="choosePhotoFromLibrary"){
        choosePhotoFromLibrary()
      }else{
        takePhotoFromCamera()
      };
      }}
    />  
    
             </View>
)
}