import React, { useState } from 'react'
import { Image, ImageBackground, Text, TextInput, View } from 'react-native'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../utils/Dimensions';
import MaterialIcons from 'react-native-vector-icons/Ionicons'
import { ScrollView } from 'react-native-gesture-handler';
const PROFILE_PIC = require("../assets/images/fray-bekele-EuzwQ8sIpNY-unsplash.jpg");
const POST = require("../assets/images/marina-abrosimova-_dcZHDd9puM-unsplash.jpg");
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Ionicons';
// import { FullWindowOverlay } from 'react-native-screens';
// import BottomSheet from '@gorhom/bottom-sheet';
// import MultiSelect from 'react-native-multiple-select';

export default function EditProfileScreen(){
    const [name,setName]=useState();
    const [category,setCategory]=useState();
    const [description,setDescription]=useState();
    const [website,setWebsite]=useState();

    const[isBottomSheetVisible,setIsBottomSHeetVisible]=useState(false)
    const [open, setOpen] = useState(false);
    const [form,setForm]=useState({})
      

  
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
        <View style={{flex:1,backgroundColor:'white'}}>
            {/* <ScrollView> */}
           <ImageBackground source={POST} style={{width:SCREEN_WIDTH,height:SCREEN_HEIGHT*0.2}}>
          

            <Image  source={PROFILE_PIC} borderRadius={100} style={{width:150,height:150,alignSelf:'center',justifyContent:'flex-end',top:100, borderWidth:5,borderColor:'white'}}/>
            <Icon style={{alignSelf:'center',top:50,left:60}} name='camera' size={48}/>
            </ImageBackground>
                    <Icon onPress={()=>setIsBottomSHeetVisible(true)} style={{alignSelf:'flex-end',position:'absolute'}} name='camera' size={48}/>

            <View style={{ marginTop: 50, marginHorizontal: 10 }}>
            {/* <ScrollView> */}
                <View style={{marginVertical:10}}>
                   
                    <Text>                
                         <MaterialIcons name='business-outline' />
                        Business Name</Text>
                        
                    <TextInput name="name" onChangeText={setName}style={{borderBottomWidth:1,padding:2}} placeholder='Business Name'></TextInput>
                </View>
                <View style={{marginVertical:10}}>
                   
                    <Text>                
                         <MaterialIcons name='business-outline' />
                        Business description</Text>
                    <TextInput multiline={true} onChangeText={setDescription} style={{borderBottomWidth:1,padding:2,minHeight:20}} placeholder='Business Name'></TextInput>
                </View>
                <View style={{marginVertical:10}}>
                   
                   <Text>                
                        <MaterialIcons name='business-outline' />
                       Business Website</Text>
                   <TextInput onChangeText={setWebsite} style={{borderBottomWidth:1,padding:2}} placeholder='Business Name'></TextInput>
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
               
               
            </View>

            {/* </ScrollView> */}
           
        </View>
    )
}