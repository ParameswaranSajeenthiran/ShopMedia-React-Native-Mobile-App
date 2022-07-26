import * as React from 'react';
import { View, Text, Button, Image } from 'react-native';
import { AuthContext } from './AuthContext';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../utils/Dimensions';
const POST = require("../assets/images/marina-abrosimova-_dcZHDd9puM-unsplash.jpg");
import { ClusterMap } from 'react-native-cluster-map';

import RBSheet from 'react-native-raw-bottom-sheet';
// import BottomSheet from "react-native-gesture-bottom-sheet";
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
// import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import Icon  from 'react-native-vector-icons/Ionicons';
import feedStyles from '../styles/feedStyles';
import firestore from '@react-native-firebase/firestore'
import { useFocusEffect } from '@react-navigation/native';
// import BottomSheet from '@gorhom/bottom-sheet';
const PROFILE_PIC = require("../assets/images/fray-bekele-EuzwQ8sIpNY-unsplash.jpg");
import GetLocation from 'react-native-get-location'
// import  Icon  from 'react-native-vector-icons/Ionicons';
export default function SearchScreen({ navigation }) {
  const categories=['saloon','grocery','fashion','food']
    const {user,logout}=React.useContext(AuthContext)
    const refRBSheet = React.useRef();
    const sheetRef = React.useRef(null);
    const mapRef = React.useRef(null);

    const[users,setUsers]=React.useState([])
    
  const [posts, setPosts] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [userLocation,setUserLocation]=React.useState({})
const[filters,setFilters]=React.useState([])
const[searchResults,setSearchResults]=React.useState([])
const[isSearchBarVisible,setIsSearchVisible]=React.useState(false)
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
        fetchUsers(location)

      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      })
  
    }, [ ])
  )  

  const getUsersByFilters = async (filter,userLocation) => { 
    console.log(filter)
let arr=[]
    if(filters.includes(filter)){
      arr=filters;
       arr = arr.filter(function(value, index, arr){ 
        return value !=filter;
    });
      setFilters(arr)
      console.log(arr)

      // return;
    }  
  else{
    arr=[...filters,filter]
    setFilters([...filters,filter]) 
    console.log([...filters,filter])

  }
    try {
      let list = [];

      if(arr.length!=0){
      await firestore()
        .collection('users') .where('category', 'in',arr)
          .get()
        .then((querySnapshot) => {
          console.log('Total Posts: ', querySnapshot.size);

          querySnapshot.forEach((doc) => {
            const {
             userImg,
             name,
             location,
             userId,
             posts,
             category
             
            } = doc.data();
            
            if(location.longitude<=userLocation.longitude+ 0.06421&& location.longitude>=userLocation.longitude- 0.0621 &&location.latitude<=userLocation.latitude+ 0.66421&& location.latitude>=userLocation.latitude- 0.6621 &&category!="customer" ){
             if(posts.length!=0){
              list.push({
                id: doc.id,
                name,
                userImg,
                location,
                userId,
                posts
              });}}
          });
        });
        setPosts(list);
      }else{
fetchUsers(userLocation)
      }
   
      console.log(list);

      if (loading) {
        setLoading(false);
      }
      

      console.log('Posts: ', posts);
    } catch (e) {
      console.log(e);
    }
  }
  // React.useEffect(()=>{
  //     fetchUsers()

  //       // refRBSheet.current.open()
  //       // sheetRef.current.show()
  //       sheetRef.current.snapTo(0)
  //   },[])
  
   
const search=(value)=>{
  console.log(value)
  let regex="/"+value+"/i"
 let results= posts.filter((item)=>{
  console.log(item.name.search(value))
  return  item.keySearchWords?item.keySearchWords.search(value)!=-1:item.name.search(value)!=-1
})
console.log(results,"results")
setSearchResults(results)
}
    const fetchUsers = async (userLocation) => {
      try {
        let list = [];
  
        await firestore()
          .collection('users').where("location.latitude","<",userLocation.latitude+0.1922).where("location.latitude",">",userLocation.latitude-0.1922 )
            .get()
          .then((querySnapshot) => {
            console.log('Total Posts: ', querySnapshot.size);
  
            querySnapshot.forEach((doc) => {
              
              const {
               userImg,
               name,
               location,
               userId,
               posts,
               category
               
              } = doc.data();

              if(location.longitude<=userLocation.longitude+ 0.66421&& location.longitude>=userLocation.longitude- 0.6621 &&category!="customer" ){
               let posts1=[]
            
              list.push({
                id: doc.id,
                name,
                userImg,
                location,
                userId,
                posts
              });}
            });
          });
  
        setPosts(list);
        console.log(list);

        if (loading) {
          setLoading(false);
        }
        

        console.log('Posts: ', posts);
      } catch (e) {
        console.log(e);
      }
    }; 
    const bottomSheetRef = React.useRef(null);

    // variables
    // const snapPoints = React.useMemo(() => ['25%', '50%'], []);
  
    // callbacks
    // const handleSheetChanges = React.useCallback(( number) => {
    //   console.log('handleSheetChanges', index);
    // }, []);
    // const sheetRef = Re+act.useRef();
    const renderContent = () => (
        <View
          style={{
            backgroundColor: 'white',
            padding: 16,
            height: 800,
          }}
        >
          <View style={{borderBottomWidth:10, borderColor:"#e5e5e5",width:50,alignSelf:'center',borderRadius:30}}></View>
         
         {isSearchBarVisible?<View  backgroundColor="#e5e5e5" style={{flexDirection:'row',marginVertical:10}}borderRadius={10}>
         <Icon name="search" size={25} style={{marginTop:10}}/>
               <TextInput placeholder='Search'  onChangeText={(value)=>search(value)} style={{width:SCREEN_WIDTH-100}} borderRadius={10}/><Icon onPress={()=>{
                setIsSearchVisible(false)
                sheetRef.current.snapTo(2)
                setSearchResults([])
               }} name="close-circle-outline" style={{marginTop:10}} color={'black'} size={20}/>
         </View>:  <View style={{flexDirection:'row',width:SCREEN_WIDTH}}><View style={{width:SCREEN_WIDTH-100}}><Text style={{fontSize:16,fontWeight:'700'}}>Western Province </Text></View><View style={{alignSelf:'flex-end',alignContent:"flex-end"}}>
            <Icon onPress={()=>{sheetRef.current.snapTo(0)
            setIsSearchVisible(true)}} name="search" size={40} style={{alignSelf:'flex-end'}}/></View></View>  }
         
        
          <ScrollView  showsHorizontalScrollIndicator={false} horizontal >
          <View style={{flexDirection:'row',marginVertical:10}}>



    

          {categories.map((category)=>(
            <TouchableOpacity onPress={()=> getUsersByFilters(category,userLocation)}>
            <View style={filters.includes(category)? {borderRadius:10,backgroundColor:'#e5e5e5', justifyContent:'space-between', marginHorizontal:10,padding:2,height:SCREEN_HEIGHT*0.03,width:SCREEN_WIDTH*0.2,flexDirection:'row'}:{borderRadius:10,borderWidth:0.5,justifyContent:'space-between', marginHorizontal:15,padding:2,paddingLeft:15,height:SCREEN_HEIGHT*0.03,width:SCREEN_WIDTH*0.2,flexDirection:'row'}}>
              <Text onPress={()=>{
              
            }} >
              {category}
              </Text>
              {filters.includes(category)?<Icon name="close-circle-outline" color={'black'} size={20}/>:null} 
            </View>
            </TouchableOpacity>
          ))}
          </View>
          </ScrollView>
          <ScrollView >
            {!isSearchBarVisible?posts?(posts.map((item)=>{
return( item.posts.category!="customer"?(  <View style={{marginVertical:20}}>
  <TouchableOpacity onPress={()=>{
    const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 }
    console.log(item)
    sheetRef.current.snapTo(2)
    let initialRegion = Object.assign({}, item.location);
// let initialRegion
    initialRegion["latitudeDelta"] = 0.005;
    initialRegion["longitudeDelta"] = 0.005;
//  mapRef.current.fitToSuppliedMarkers(posts.map((item)=>item.userId))
mapRef.current.animateToRegion(initialRegion, 2000);
  }}>
  <View style={feedStyles.userInfo}>
        <Image source={item.userImg?{uri:item.userImg}:PROFILE_PIC} style={feedStyles.userImg}>

        </Image>
        <View style={feedStyles.userName}>
            <Text style={feedStyles.userNameText}>
                {item.name}
            </Text>

        </View>
        
        
        
    </View> 
    </TouchableOpacity> 
    <ScrollView horizontal>
    <View style={{flexDirection:'row',marginVertical:10}}>
  {item.posts?item.posts.map((post)=>{
    return(
      <TouchableOpacity onPress={()=>navigation.navigate("BusinessFeedScreen",{
        userId:item.userId
      })}>
      <View>
      
      <Image source={{uri:post.postImg}} style={{width:SCREEN_WIDTH/3,height:SCREEN_HEIGHT/6}}/>
      
      </View>
      </TouchableOpacity>
    )
  }):<View><Text>HIihih</Text></View>}
{/* {item.userPost?item.userPost.map((post)=>{ 
  return(
  <View>
  <Image source={POST} style={{width:SCREEN_WIDTH/3,height:SCREEN_HEIGHT/6}}/>
  
  </View>
)})} */}


    </View>
    </ScrollView> 
  </View>
  
):null)
            })):null:searchResults.map((item)=>{
              return( item.posts?(  <View style={{marginVertical:20}}>
               <TouchableOpacity onPress={()=>{
    const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 }
    console.log(item)
    sheetRef.current.snapTo(2)
    let initialRegion = Object.assign({}, item.location);
// let initialRegion
    initialRegion["latitudeDelta"] = 0.005;
    initialRegion["longitudeDelta"] = 0.005;
//  mapRef.current.fitToSuppliedMarkers(posts.map((item)=>item.userId))
mapRef.current.animateToRegion(initialRegion, 2000);
  }}>
                <View style={feedStyles.userInfo}>
                      <Image source={item.userImg?{uri:item.userImg}:PROFILE_PIC} style={feedStyles.userImg}>
              
                      </Image>
                      <View style={feedStyles.userName}>
                          <Text style={feedStyles.userNameText}>
                              {item.name}
                          </Text>
              
                      </View>
                      
                      
                      
                  </View> 
                  </TouchableOpacity> 
                  {/* <ScrollView horizontal> */}
                  <View style={{flexDirection:'row',marginVertical:10}}>
                {item.posts?item.posts.map((post)=>{
                  return(
                    <TouchableOpacity onPress={()=>navigation.navigate("BusinessFeedScreen",{
                      userId:item.userId
                    })}>
                    <View>
                    
                    <Image source={{uri:post.postImg}} style={{width:SCREEN_WIDTH/3,height:SCREEN_HEIGHT/6}}/>
                    
                    </View>
                    </TouchableOpacity>
                  )
                }):<View><Text>HIihih</Text></View>}
              {/* {item.userPost?item.userPost.map((post)=>{ 
                return(
                <View>
                <Image source={POST} style={{width:SCREEN_WIDTH/3,height:SCREEN_HEIGHT/6}}/>
                
                </View>
              )})} */}
              
              
                  </View>
                  {/* </ScrollView>  */}
                </View>
                
              ):null)
                          })}
         
         
          </ScrollView>
        </View>
      );
    return (
        <>
        <View style={mapStyles.container}>
      {/* <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={[450, 300, 10]}
        // onChange={handleSheetChanges}
      >
        <View style={styles.contentContainer}>
          <Text>hi</Text>
        </View>
      </BottomSheet> */}
        {/* <View
        style={{
          flex: 1,
          backgroundColor: 'papayawhip',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      > */}
  <MapView
  ref={mapRef}
    //    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
       style={mapStyles.map}
      //  onRegionChange={setLocation}
      
       region={{
        latitude:userLocation.latitude?userLocation.latitude: 37.78825,
        longitude:userLocation.longitude?userLocation.longitude: -122.4324,
        latitudeDelta: 0.1922,
        longitudeDelta: 0.0421,
       }}
      //  onRegionChange={posts}
       
  >

{posts ?<Marker
        key={posts?posts[0].id:1}
        coordinate={!userLocation?posts[0].location:userLocation}

     />:null}


       

      
    {!isSearchBarVisible?posts? posts.map((user)=>{

      return(
       user.posts.length!=0?( <Marker
        key={user.id}
        coordinate={user.location}

      >


        <Image source={user.userImg?{uri:user.userImg}: PROFILE_PIC} style={feedStyles.userImg}>

        </Image>
        <Text style={{ color: "black", fontWeight: 'bold', alignSelf: 'center' }}>{user.name}</Text>

      </Marker>
      ):null)
    }):null:searchResults.map((user)=>{
      return(
        <Marker
        key={user.userId}
        coordinate={user.location}

      >


        <Image source={user.userImg?{uri:user.userImg}: PROFILE_PIC} style={feedStyles.userImg}>

        </Image>
        <Text style={{ color: "black", fontWeight: 'bold', alignSelf: 'center' }}>{user.name}</Text>

      </Marker>
      )
    })}
           
     </MapView>
     {/* <RBSheet
     ref={refRBSheet}
     dragFromTopOnly={true}
     height={100}
     openDuration={250}
     customStyles={{
        wrapper: {
            backgroundColor: "transparent"
          },
       container: {
         justifyContent: "center",
         alignItems: "center"
       },  draggableIcon: {
        backgroundColor: "#000"
      }
     }}>


     </RBSheet> */}
   
      {/* <BottomSheet
      
  
      hasDraggableIcon ref={bottomSheet} height={600} />
      <TouchableOpacity
        // style={styles.button}
        onPress={() => bottomSheet.current.show()}
      >
        <Text >Open modal</Text>
      </TouchableOpacity> */}
    {/* </View> */}

       <BottomSheet
        ref={sheetRef}
    initialSnap={2}
    
        snapPoints={[900, 550, 350]}
        borderRadius={50}
        renderContent={renderContent}
        enabledBottomClamp={true}
        onCloseEnd={()=>sheetRef.current.snapTo(2)}
        // callbackNode={0}
        // borderRadius={50}
      />
   </View>
</>
    );
}
const mapStyles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      height: SCREEN_HEIGHT,
      width: SCREEN_WIDTH,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    button: {
        height: 50,
        width: 150,
        backgroundColor: "#140078",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        shadowColor: "#8559da",
        shadowOpacity: 0.7,
        shadowOffset: {
          height: 4,
          width: 4,
        },
        shadowRadius: 5,
        elevation: 6,
      },
      text: {
        color: "white",
        fontWeight: "600",
      },
   });
   

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: 'grey',
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center',
    },
  });
  