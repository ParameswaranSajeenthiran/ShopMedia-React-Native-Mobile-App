import React, { useContext, useEffect, useRef, useState } from 'react'
import { Alert, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../utils/Dimensions';
import MaterialIcons from 'react-native-vector-icons/Ionicons'
import { ScrollView } from 'react-native-gesture-handler';
const PROFILE_PIC = require("../assets/images/fray-bekele-EuzwQ8sIpNY-unsplash.jpg");
const POST = require("../assets/images/marina-abrosimova-_dcZHDd9puM-unsplash.jpg");
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from './AuthContext';
import firestore from '@react-native-firebase/firestore'
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import GetLocation from 'react-native-get-location'


// import { TouchableOpacity } from 'react-native-gesture-handler';

import RBSheet from 'react-native-raw-bottom-sheet';
import MapView, { Marker } from 'react-native-maps';
import feedStyles from '../styles/feedStyles';


export default function EditProfileScreen(){
    const [name,setName]=useState("");
    const [category,setCategory]=useState("");
    const [description,setDescription]=useState("");
    const [website,setWebsite]=useState("");
 
    const refRBSheet = useRef();
        const[isBottomSheetVisible,setIsBottomSHeetVisible]=useState(false)
    const [open, setOpen] = useState(false);
    const [form,setForm]=useState({})
      
     const {user, logout} = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [userData, setUserData] = useState({});
  const [location,setLocation ]=useState({})

  useEffect(()=>{


getUser()
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


  },[])
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

  const handleUpdate = async() => {
    let imgUrl = await uploadImage();

    if( imgUrl == null && userData.userImg ) {
      console.log(imgUrl,"56")
      imgUrl = userData.userImg;
    }
    // console.log(userData.userImg,"59")

    firestore()
    .collection('users'). 
    doc(user.uid).   
    update({
      userId:user.uid,
      name:userData.name,
      website:userData.website,
     category:category,
     description:userData.description,
      userImg: imgUrl,
      location:location
    })
    .then(() => {
      console.log('User Updated!');
      Alert.alert(
        'Profile Updated!',
        'Your profile has been updated successfully.'
      );
    }).catch((e)=>{
      console.log(e,"________________________________________")
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
      
      

    const [items, setItems] = useState([
        {label: 'Saloon', value: 'apple'},
        {label: 'Fashion', value: 'Fashion'}
      ]);
      DropDownPicker.setListMode("SCROLLVIEW")



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
    
          Alert.alert(
            'Image uploaded!',
            'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
          );
          return url;
    
        } catch (e) {
          console.log(e,"error#####################");
          return null;
        }
    
      };
    return(
        <View style={{flex:1,backgroundColor:'white'}}>
            {/* <ScrollView> */}
           <ImageBackground source={POST} style={{width:SCREEN_WIDTH,height:SCREEN_HEIGHT*0.2}}>
      

            <Image  source={{ uri: image? image:userData.userImg}} borderRadius={100} style={{width:150,height:150,alignSelf:'center',justifyContent:'flex-end',top:100, borderWidth:5,borderColor:'white'}}/>
            <Icon style={{alignSelf:'center',top:50,left:60}} name='camera' size={48}/>
            </ImageBackground>
                    <Icon onPress={() => refRBSheet.current.open()}style={{alignSelf:'flex-end',position:'absolute'}} name='camera' size={48}/>

            <View style={{ marginTop: 50, marginHorizontal: 10 }}>
            {/* <ScrollView> */}
                <View style={{marginVertical:10}}>
              
                    <Text>                
                         <MaterialIcons name='business-outline' />
                        Business Name</Text>
                        
                    <TextInput name="name" value={userData.name} onChangeText={(txt) => setUserData({...userData, name: txt})}style={{borderBottomWidth:1,padding:2}} placeholder='Business Name'></TextInput>
                </View>
                <View style={{marginVertical:10}}>
                   
                    <Text>                
                         <MaterialIcons name='business-outline' />
                        Business description</Text>
                    <TextInput multiline={true} value={userData.description } onChangeText={(txt) => setUserData({...userData, description: txt})}style={{borderBottomWidth:1,padding:2,minHeight:20}} placeholder='Business Name'></TextInput>
                </View>
                <View style={{marginVertical:10}}>
                   
                   <Text>                
                        <MaterialIcons name='business-outline' />
                       Business Website</Text>
                   <TextInput value={userData.website} onChangeText={(txt) => setUserData({...userData, website: txt})} style={{borderBottomWidth:1,padding:2}} placeholder='Business Name'></TextInput>
               </View>
                <View style={{marginVertical:10}}>
                   
                    <Text>                
                         <MaterialIcons name='business-outline' />
                        Business Category</Text>
                      
                    {/* <TextInput style={{borderBottomWidth:1,padding:2}} placeholder='Business Name'></TextInput> */}
                </View>
                {/* </ScrollView> */}
                <DropDownPicker open={open}
      value={category}
      
      items={items}
      setOpen={setOpen}
      setValue={setCategory} 
      setItems={setItems}/>
               <TouchableOpacity onPress={()=>handleUpdate()}>
               <View>
                <Text>
                  Upload
                </Text>
               </View>
               </TouchableOpacity>
            </View>
            <MapView
                   style={mapStyles.map}
                   initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0,
                    longitudeDelta: 0.0,
                }}
                   >
              <Marker
              coordinate={{
                latitude: 37.78825,
                longitude: -122.4324
              }}>
                 <Image source={PROFILE_PIC} style={feedStyles.userImg}>

</Image>
              </Marker>
            </MapView>
            <RBSheet
         ref={refRBSheet}
          height={100}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center"
            }
          }}
        >
          <View>
  {/* <TouchableOpacity style={{backgroundColor:'red'}} > */}
  <TouchableOpacity onPress={()=>choosePhotoFromLibrary()}>
            <View >
            <Text   style={{marginVertical:10}}>
                Upload Image
            </Text>
            </View>
            </TouchableOpacity>
            {/* </TouchableOpacity> */}
            
            {/* <TouchableOpacity style={{backgroundColor:'red'}} onPress={()=>takePhotoFromCamera()}> */}
            <TouchableOpacity onPress={()=>takePhotoFromCamera()}>
            <View >
            <Text   style={{marginVertical:10}}>
                Upload Image
            </Text>
            </View>
            </TouchableOpacity>
            {/* </TouchableOpacity> */}
            </View>
        </RBSheet>
            {/* </ScrollView> */}
           
        </View>
    )
}
const mapStyles = StyleSheet.create({
  container: {
    
    height: SCREEN_HEIGHT*0.4,
    width: SCREEN_WIDTH,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    height: SCREEN_HEIGHT*0.4
    // ...StyleSheet.absoluteFillObject,
  },})