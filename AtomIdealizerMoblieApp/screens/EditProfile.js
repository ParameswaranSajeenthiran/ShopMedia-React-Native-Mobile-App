import React, { useContext, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Alert, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../utils/Dimensions';
import MaterialIcons from 'react-native-vector-icons/Ionicons'
import { ScrollView } from 'react-native-gesture-handler';
const PROFILE_PIC = require("../assets/images/fray-bekele-EuzwQ8sIpNY-unsplash.jpg");
const POST = require("../assets/images/marina-abrosimova-_dcZHDd9puM-unsplash.jpg");
import DropDownPicker from 'react-native-dropdown-picker';
import { AuthContext } from './AuthContext';
import firestore from '@react-native-firebase/firestore'
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import GetLocation from 'react-native-get-location'
import  Icon from 'react-native-vector-icons/Ionicons';

// import { TouchableOpacity } from 'react-native-gesture-handler';

import RBSheet from 'react-native-raw-bottom-sheet';
import MapView, { Marker } from 'react-native-maps';
import feedStyles from '../styles/feedStyles';
import { useFocusEffect } from '@react-navigation/native';
import styles from './SignUpScreen'

export default function AddProfile({ route, navigation } ){
    const [category,setCategory]=useState(null);
  
 
    const refRBSheet = useRef();
        const[isBottomSheetVisible,setIsBottomSHeetVisible]=useState(false)
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

     const {user, logout} = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const[backgroundImg,setBackgroundImage]=useState(null);
  const[isBackgroundImageUpload,setIsBackgroundImageUpload]=useState(false)
  const [transferred, setTransferred] = useState(0);
  const [userData, setUserData] = useState({});
  const [location,setLocation ]=useState(null)
const{initialUserData}=route.params
useEffect(()=>{
// getUser();
console.log(userData,"useEffect")

// navigation.setOptions({
//   // title: 'POST',
//   headerRight:()=>(

//     // <TouchableOpacity onPress={()=>handleUpdate()}>
//     // <View>
//     //  <Text>
//     //    Upload
//     //  </Text>
//     // </View>
//     // </TouchableOpacity>

//   )})

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
//   useFocusEffect(
//     React.useCallback(() => {    
     
// console.log(getUser())

// navigation.setOptions({
//   // title: 'POST',
//   headerRight:()=>(

//     <TouchableOpacity onPress={()=>handleUpdate()}>
//     <View>
//      <Text>
//        Upload
//      </Text>
//     </View>
//     </TouchableOpacity>

//   )})
// console.log(user)
// GetLocation.getCurrentPosition({
//   enableHighAccuracy: true,
//   timeout: 15000,
// })
// .then(location => {
//   console.log(location);
//   // setUserData({...userData,location:{latitude:location.latitude,longitude:location.longitude}})
//   setLocation({latitude:location.latitude,longitude:location.longitude})

// })
// .catch(error => {
//   const { code, message } = error;
//   console.warn(code, message);
// }) },[]))
//   useEffect(()=>{


// getUser()

// navigation.setOptions({
//   // title: 'POST',
//   headerRight:()=>(

//     <TouchableOpacity onPress={()=>handleUpdate()}>
//     <View>
//      <Text>
//        Upload
//      </Text>
//     </View>
//     </TouchableOpacity>

//   )})
// console.log(user)
// GetLocation.getCurrentPosition({
//   enableHighAccuracy: true,
//   timeout: 15000,
// })
// .then(location => {
//   console.log(location);
//   // setUserData({...userData,location:{latitude:location.latitude,longitude:location.longitude}})
//   setLocation({latitude:location.latitude,longitude:location.longitude})

// })
// .catch(error => {
//   const { code, message } = error;
//   console.warn(code, message);
// })
//   },[navigation])


  const getUser = async() => {
    const currentUser = await firestore()
    .collection('users')
    .doc(user.uid)
    .get()
    .then((documentSnapshot) => {
      if( documentSnapshot.exists ) {
        console.log('User Data', documentSnapshot.data());
        setUserData(documentSnapshot.data());
       
        console.log("userDAta",userData)
      }

    })
  }


  const handleUpdate = async() => {
    let imgUrl = await uploadImage(image);
    let backgroundImgUrl = await uploadImage(backgroundImg);
console.log("inmg",imgUrl,"initialUserData",backgroundImgUrl)
    if(imgUrl==null && initialUserData.userImg!==null){
      imgUrl=initialUserData.userImg
    }


    if(backgroundImgUrl==null && initialUserData.backgroundImgUrl!==null){
      backgroundImgUrl=initialUserData.backgroundImgUrl
    }

    console.log({
      userId:user.uid,
      name:userData.name?userData.name:initialUserData.name,
      website:userData.website?userData.website:initialUserData.website,
     category:userData.category?userData.category:initialUserData.category,
     description:userData.description?userData.description:initialUserData.description,
      userImg: imgUrl,
      backgroundImgUrl:backgroundImgUrl,
      location:location
    })
    // if( imgUrl == null && userData.userImg ) {
    //   console.log(imgUrl,"56")
    //   imgUrl = userData.userImg;
    // }
    // console.log(userData.userImg,"59")

    firestore()
    .collection('users'). 
    doc(user.uid).   
    update({
      userId:user.uid,
      name:userData.name?userData.name:initialUserData.name,
      website:userData.website?userData.website:initialUserData.website,
     category:userData.category?userData.category:initialUserData.category,
     description:userData.description?userData.description:initialUserData.description,
      userImg: imgUrl,
      backgroundImgUrl:backgroundImgUrl,
      location:location,
      keySearchWords:userData.keySearchWords
    })
    .then(() => {
      console.log('User Updated!');
      // Alert.alert(
      //   'Profile Updated!',
      //   'Your profile has been updated successfully.'
      // );
      navigation.navigate("ProfileScreen")
    }).catch((e)=>{
      console.log(userData)
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
          if(isBackgroundImageUpload){
            setBackgroundImage(image.path)
            setIsBackgroundImageUpload(false)
          }else{
            setImage(image.path);
          }
          refRBSheet.current.close()


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
          if(isBackgroundImageUpload){
            setBackgroundImage(image.path)
            setIsBackgroundImageUpload(false)
          }else{
            setImage(image.path);
          }
          refRBSheet.current.close()
        });
      };
      
      

    const [items, setItems] = useState([
        {label: 'Saloon', value: 'saloon'},
        {label: 'Fashion', value: 'fashion'},
        {label:'Food',value:'food'}
      ]);
      DropDownPicker.setListMode("SCROLLVIEW")



      const uploadImage = async (img) => {
        if( img == null ) {
          return null;
        }
        const uploadUri = img;
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
          console.log(e,"error#####################");
          return null;
        }
    
      };
    return(
        <View style={{flex:1,backgroundColor:'white',alignContent:'center'}}>
            <ScrollView>
           <ImageBackground source={backgroundImg!=null ?{ uri: backgroundImg}:(initialUserData?{uri:initialUserData.backgroundImgUrl}:PROFILE_PIC)} style={{width:SCREEN_WIDTH,height:SCREEN_HEIGHT*0.2}}>
      

            <Image  source={image?{ uri: image}:(initialUserData?{uri:initialUserData.userImg}:PROFILE_PIC)}  borderRadius={100} style={{width:150,height:150,alignSelf:'center',justifyContent:'flex-end',top:100, borderWidth:5,borderColor:'white'}}/>
            <Icon onPress={() => {refRBSheet.current.open()}} style={{alignSelf:'center',top:50,left:60}} name='camera' size={48}/>
            </ImageBackground>
                    <Icon onPress={() => {refRBSheet.current.open()
                    
                    setIsBackgroundImageUpload(true)}}style={{alignSelf:'flex-end',position:'absolute'}} name='camera' size={48}/>

            <View style={{ marginTop: 50, marginHorizontal: 10 }}>
            {/* <ScrollView> */}
                <View style={{marginVertical:10}}>
              
                    <Text>                
                         <MaterialIcons name='business-outline' />
                        Business Name</Text>
                        
                    <TextInput name="name" value={userData.name?userData.name:initialUserData.name} onChangeText={(txt) => setUserData({...userData, name: txt})}style={{borderBottomWidth:1,padding:2}} placeholder='Business Name'></TextInput>
                </View>
                <View style={{marginVertical:10}}>
                   
                    <Text>                
                         <MaterialIcons name='business-outline' />
                        Business description</Text>
                    <TextInput multiline={true} value={userData.description?userData.description:initialUserData.description} onChangeText={(txt) => setUserData({...userData, description: txt})}style={{borderBottomWidth:1,padding:2,minHeight:20}} placeholder='Business Description'></TextInput>
                </View>
                <View style={{marginVertical:10}}>
                   
                   <Text>                
                        <MaterialIcons name='business-outline' />
                       Business Website</Text>
                   <TextInput  value={userData.website?userData.website:initialUserData.website} onChangeText={(txt) => setUserData({...userData, website: txt})} style={{borderBottomWidth:1,padding:2}} placeholder='Business Website'></TextInput>
               </View>
               <View style={{marginVertical:10}}>
                   
                   <Text>                
                        <MaterialIcons name='business-outline' />
                       Key Search Words</Text>
                   <TextInput  value={userData.keySearchWords?userData.keySearchWords:initialUserData.keySearchWords} onChangeText={(txt) => setUserData({...userData, keySearchWords: txt})} style={{borderBottomWidth:1,padding:2}} placeholder='Business Website'></TextInput>
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
           <View style={{marginVertical:10}}> 
                   
                   <Text>                
                        <MaterialIcons name='business-outline' />
                      Location</Text>
                     
                   {/* <TextInput style={{borderBottomWidth:1,padding:2}} placeholder='Business Name'></TextInput> */}
               </View>    
            </View>
            {/* <MapView
            
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
            </MapView> */}
    
          
    <TouchableOpacity onPress={()=>handleUpdate()}>

    <View style={{width:SCREEN_WIDTH-20,backgroundColor:"#0077B5",height:SCREEN_HEIGHT*0.06,borderRadius:50,alignItems:'center'}}>
                
          {uploading? <View>
            <Text>{transferred} % Completed!</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>:  <Text style={{fontSize:24,fontWeight:"bold",color:'white',marginVertical:5}}> Save changes</Text>} 
             
          
 </View>
 </TouchableOpacity>

 
            <RBSheet
         ref={refRBSheet}
          height={100}
          openDuration={250}
          customStyles={{ 
            container: {
              justifyContent: "center",
              alignItems: "flex-start"
            }
          }}
        >
          <View>
  {/* <TouchableOpacity style={{backgroundColor:'red'}} > */}
  <TouchableOpacity onPress={()=>choosePhotoFromLibrary()}>
            <View style={{flexDirection:'row'}} >
              <Icon name="image" size={30}/>
            <Text style={{fontSize:20,marginLeft:10}}  >
                Upload Image
            </Text>
            </View>
            </TouchableOpacity>
            {/* </TouchableOpacity> */}
            
            {/* <TouchableOpacity style={{backgroundColor:'red'}} onPress={()=>takePhotoFromCamera()}> */}
            <TouchableOpacity onPress={()=>takePhotoFromCamera()}>
            <View style={{flexDirection:'row'}} >
            <Icon name="camera" size={30}/>

            <Text style={{fontSize:20,marginLeft:10}}  >
               Take Photo From Camera
            </Text>
            </View>
            </TouchableOpacity>
            {/* </TouchableOpacity> */}
            </View>
        </RBSheet>
            </ScrollView>
           
        </View>
    )
}
const mapStyles = StyleSheet.create({
  container: {
    
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH-40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    height: SCREEN_HEIGHT*0.4,
    width:SCREEN_WIDTH-40,
    marginHorizontal:20
    // ...StyleSheet.absoluteFillObject,
  },})