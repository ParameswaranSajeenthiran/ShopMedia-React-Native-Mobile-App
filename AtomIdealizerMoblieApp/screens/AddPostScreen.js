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
import Moment from 'moment';
export default function AddPostScreen({ route, navigation }) {
  const actions = [
    {

      icon: <MaterialIcon name="photo" size={48} />,
      name: "takePhotoFromCamera",
      position: 4,
      color: "white",

    },

    {

      icon: <MaterialIcon name="camera" size={48} />,
      name: "choosePhotoFromLibrary",
      position: 4,
      color: "white",

    }
  ];

  const [image, setImage] = React.useState(null);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("")
  const [price, setPrice] = React.useState(null)

  const [uploading, setUploading] = React.useState(false);
  const [transferred, setTransferred] = React.useState(0);
  const [post, setPost] = React.useState(null);
  const [userData, setUserData] = React.useState({});


  const { user, logout } = React.useContext(AuthContext);

  
  React.useEffect(() => {
getUser();
    navigation.setOptions({
      // title: 'POST',
      headerRight:()=>(
        < View >
        <TouchableOpacity onPress={() => submitPost()} >
          <View>
            <Text style={{alignSelf:'flex-end',color:'#0077B5',marginRight:20,fontSize:24}} >POST</Text>
            <View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      ),
      headerLeft:()=>(
        < View >
        <TouchableOpacity onPress={() => navigation.navigate("FeedScreen")} >
          <View>
            <Text style={{alignSelf:'flex-end',color:'#0077B5',marginLeft:20,fontSize:20}} >CANCEL</Text>
            <View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      )
    });    const { action, imageUri } = route.params
    setImage(imageUri)

  }, [])

    const getUser = async() => {
    const currentUser = await firestore()
    .collection('users')
    .doc(user.uid)
    .get()
    .then((documentSnapshot) => {
      if( documentSnapshot.exists ) {
        console.log('User Data', documentSnapshot.data());
        setUserData(documentSnapshot.data());
      }
    })
  }
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
        userName:userData.name,
        userImg:userData.userImg,
        title: title,
        description: description,
        price: price,
        postImg: imageUrl,
        postTime: firestore.Timestamp.fromDate(new Date()),
        rating: 0,
        reviews: 0,
      })
      .then(() => {
        firestore()
          .collection('users').
          doc(user.uid).
          update({
            posts: firestore.FieldValue.arrayUnion({ postImg: imageUrl })


          })

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
    if (image == null) {
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

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View >
        <View style={feedStyles.userInfo}>

          {/* <View> {image != null ? <Image source={{uri: image}} /> : null}        </View> */}
          <Image source={{uri:userData.userImg}} style={feedStyles.userImg}>

          </Image>
          <View style={feedStyles.userName}>
            <Text style={feedStyles.userNameText}>
             {userData.name}
            </Text>

          </View>



        </View>



      </View>
      <View >
        <ImageBackground borderRadius={50} source={{ uri: image }} style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.45, alignSelf: 'center' }}>
          <View style={{ top: 250, marginHorizontal: 10, maxHeight: 100, flexDirection: 'column' }}>
            <TextInput onChangeText={setTitle} style={{ fontSize: 48, marginBottom: 0, padding: 0, ...feedStyles.heading }} placeholderTextColor="white" placeholder='Type Here to give Your Product A Title' />

            <TextInput multiline maxLength={60} onChangeText={setDescription} style={{ fontSize: 24, marginBottom: 0, padding: 0, ...feedStyles.heading }} placeholderTextColor="white" placeholder='Describe about Your Product' />
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 24, marginBottom: 0, padding: 0, ...feedStyles.heading }} >Rs.</Text>
              <TextInput onChangeText={setPrice} keyboardType='numeric' style={{ fontSize: 24, marginBottom: 0, padding: 0, ...feedStyles.heading }} placeholderTextColor="white" placeholder='Type the cost' />
            </View>   
             </View>
        </ImageBackground>

      </View>
      < View >
       
      </View>
      <FloatingAction


        actions={actions}
        onPressItem={name => {
          if (name == "choosePhotoFromLibrary") {
            choosePhotoFromLibrary()
          } else {
            takePhotoFromCamera()
          };
        }}
      />

    </View>
  )
}