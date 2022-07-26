import React, { useContext, useEffect } from "react";
import { View,Text, TouchableOpacity,SafeAreaView, Dimensions ,Image, StyleSheet,StatusBar,ScrollView} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useState } from "react";
import { AuthContext } from "./AuthContext";
import CheckBox from '@react-native-community/checkbox';
import { firebase } from "@react-native-firebase/firestore";
import GetLocation from 'react-native-get-location'
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import LinearGradient from 'react-native-linear-gradient';
import AddProfile from "./AddProfile";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import MaterialIcon, {colorPalette} from 'material-icons-react';

// import windowWidth from '../utils/Dimensions'
export default  LoginScreen = ({ navigation }) => {

    const windowWidth=Dimensions.get("screen").width
    const windowHeight=Dimensions.get("screen").height

    const GOOGLE= require("../assets/images/google.png");

    const{register} =useContext(AuthContext);
    const[userName,onChangeUserName]=useState("")
    const[confirmPassword,onChangeConfirmPassword]=useState("")

    const[email,onChangeEmail]=useState("")
    const[password,onChangePassword]=useState("")
    const [text, setText] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(true);
    const [isSelected, setSelection] = useState(false);
    const[type,setType]=useState("")
    const [location,setLocation ]=useState({})
    const[isVisible,setIsVisible]=useState(false)
    const[error,setError]=useState(" ")

    useEffect(()=>{
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
    const [data, setData] = React.useState({
        username: '',
        password: '',
        email:'',
        confirm_password: '',
        check_textInputChange: true,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
        check_email_change:true,
        check_confirm_password:true,
        check_password:true,
        check_email_format:true
    });

    const textInputChange = (val) => {
        if( val.length !== 0 ) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false
            });
        }
    }
    const emailInputChange = (val) => {
        if( val.length == 0 ) {
            setData({
                ...data,
                email: val,
                check_email_change: false,
                check_email_format:true
            });
        }else if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val))){
            setData({
                ...data,
                email: val,
                check_email_change: false,
                check_email_format:false
                
            });
        } 
        
        else {
            setData({
                ...data,
                email: val,
                check_email_change: true,
                check_email_format:true
                
            });
        }
    }

    const handlePasswordChange = (val) => {
        var passw=  /^[A-Za-z]\w{7,14}$/
        if(val.match(passw)){
        setData({
            ...data,
            password: val,
            check_password:true
        });}else{
            setData({
                ...data,
                password: val,
                check_password:false
            })
        }
    }

    const handleConfirmPasswordChange = (val) => {

        if(data.password==val){
       setData({
            ...data,
            check_confirm_password:true,
            confirm_password: val
        });
        }else{
        setData({
            ...data,
            confirm_password: val,
            check_confirm_password:false,

        });}
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            confirm_secureTextEntry: !data.confirm_secureTextEntry
        });
    }

    
    const  registerUser=(email,password)=>{
        console.log(data.check_confirm_password,data.check_email_format,data.check_password)

        if(!data.check_confirm_password|| !data.check_email_format|| !data.check_password){
            return
        }
register(data.email,data.password).then((res)=>{console.log(res)
    AsyncStorage.setItem('signedUp', 'true'); }).catch((error)=>{
    console.log(error,"erooorrrr")
    setError(error)
})




}
    

    return(

        <View style={styles.container}>
        <StatusBar backgroundColor='#0077B5' barStyle="light-content"/>
      <View style={styles.header}>
          <Text style={styles.text_header}>Join ShopMedia !</Text>
      </View>
      <Animatable.View 
          animation="fadeInUpBig"
          style={styles.footer}
      >
          <ScrollView>
         
          
          <Text style={[styles.text_footer]}>Email Address</Text>
              <View style={styles.action}>
              <FontAwesome 
                  name="user-o"
                  color="#05375a"
                  size={20}
              />
              <TextInput 
                  placeholder="Your Username"
                  style={styles.textInput}
                  autoCapitalize="none"
                  onChangeText={(val) => emailInputChange(val)}
              />
              {data.check_email_change ? 
              <Animatable.View
                  animation="bounceIn"
              >
                  <Feather 
                      name="check-circle"
                      color="green"
                      size={20}
                  />
              </Animatable.View>
              : null}
          </View>
          { data.check_email_format ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Check email format .</Text>
            </Animatable.View>
            }
          <Text style={[styles.text_footer, {
              marginTop: 35
          }]}>Password</Text>
          <View style={styles.action}>
              <Feather 
                  name="lock"
                  color="#05375a"
                  size={20}
              />
              <TextInput 
                  placeholder="Your Password"
                  secureTextEntry={data.secureTextEntry ? true : false}
                  style={styles.textInput}
                  autoCapitalize="none"
                  onChangeText={(val) => handlePasswordChange(val)}
              />
                         
              <TouchableOpacity
                  onPress={updateSecureTextEntry}
              >
                  {data.secureTextEntry ? 
                  <Feather 
                      name="eye-off"
                      color="grey"
                      size={20}
                  />
                  :
                  <Feather 
                      name="eye"
                      color="grey"
                      size={20}
                  />
                  }
              </TouchableOpacity>
              {data.check_password && data.password ? 
              <Animatable.View
              style={{marginHorizontal:10}}
                  animation="bounceIn"
              >
                  <Feather 
                      name="check-circle"
                      color="green"
                      size={20}
                  />
              </Animatable.View>
              : null}
          </View>
          { data.check_password ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Password must be between 7 to 16 characters which contain only characters, numeric digits, underscore and first character must be a letter.</Text>
            </Animatable.View>
            }
          <Text style={[styles.text_footer, {
              marginTop: 35
          }]}>Confirm Password</Text>
          <View style={styles.action}>
              <Feather 
                  name="lock"
                  color="#05375a"
                  size={20}
              />
              <TextInput 
                  placeholder="Confirm Your Password"
                  secureTextEntry={data.confirm_secureTextEntry ? true : false}
                  style={styles.textInput}
                  autoCapitalize="none"
                  onChangeText={(val) => handleConfirmPasswordChange(val)}
              />
             
              <TouchableOpacity
                  onPress={updateConfirmSecureTextEntry}
              >
                  {data.secureTextEntry ? 
                  <Feather 
                      name="eye-off"
                      color="grey"
                      size={20}
                  />
                  :
                  <Feather 
                      name="eye"
                      color="grey"
                      size={20}
                  />
                  }
              </TouchableOpacity>
              {data.check_confirm_password &&data.confirm_password ? 
              <Animatable.View
              style={{marginHorizontal:10}}
                  animation="bounceIn"
              >
                  <Feather 
                      name="check-circle"
                      color="green"
                      size={20}
                  />
              </Animatable.View>
              : null}
          </View>
          { data.check_confirm_password ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Password does not match.</Text>
            </Animatable.View>
            }
          <View style={styles.textPrivate}>
              <Text style={styles.color_textPrivate}>
                  By signing up you agree to our
              </Text>
              <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>{" "}Terms of service</Text>
              <Text style={styles.color_textPrivate}>{" "}and</Text>
              <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>{" "}Privacy policy</Text>
          </View>
          { error==" " ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>{error}</Text>
            </Animatable.View>
            }
          <View style={{...styles.button,marginTop:10}}>
              <TouchableOpacity
                  style={styles.signIn}
                  onPress={() => {registerUser()}}
              >
              <View
                  
                  style={styles.signIn}
              >
                  <Text style={[styles.textSign, {
                      color:'#fff'
                  }]}>Sign Up</Text>

              </View>
              </TouchableOpacity>
             <View style={{flexDirection:'row'}}>
             <Image style={{width:50,height:50,marginHorizontal:10}} source={require('../assets/images/google.png')}/>
              <Image style={{width:50,height:50,marginHorizontal:10}} source={require('../assets/images/meta.png')}/>
              </View>
              <View style={styles.textPrivate}>
              <Text style={styles.color_textPrivate}>
                 Already have an Account?
              </Text>
            
          </View>
              <TouchableOpacity
                  onPress={() => navigation.navigate("Login")}
                  style={[styles.signIn, {
                      borderColor: '#009387',
                      borderWidth: 1,
                      backgroundColor:'white',
                      marginTop: 15
                  }]}
              >
                  <Text style={[styles.textSign, {
                      color: '#009387'
                  }]}>Login In</Text>
              </TouchableOpacity>
          </View>
          </ScrollView>
      </Animatable.View>
    </View>
  
//     return (
//       <View  style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start',backgroundColor:'white' }}>
//         <View style={{justifyContent:"flex-start",marginHorizontal:10,marginTop:20}}>
//             <View>
//                 <Text style={{fontSize:30,fontWeight:"bold",color:'black',fontFamily:"Josefin Sans"}}>
//                     Join ShopMedia
//                 </Text>
//                 <TouchableOpacity onPress={()=>navigation.navigate("Login")}>
//                                 <Text  style={{fontSize:24,color:'black',  fontFamily:"Josefin Sans"}}>
//                     or   <Text style={{fontSize:24,fontWeight:"",color:'#0077B5',fontFamily:"Josefin Sans"}}>
//                    sign in
//                     </Text>
                    
//                 </Text>
//                 </TouchableOpacity>
            
//         </View>
        
//         <View style={{marginVertical:10,marginRight:50}}>
//         <Text style={styles.text_footer}>Username</Text>
//             <View style={styles.action}>
//                 <FontAwesome 
//                     name="user-o"
//                     color="#05375a"
//                     size={20}
//                 />
//                 <TextInput 
//                     placeholder="Your Username"
//                     style={styles.textInput}
//                     autoCapitalize="none"
//                     onChangeText={(val) => textInputChange(val)}
//                 />
//                 {data.check_textInputChange ? 
//                 <Animatable.View
//                     animation="bounceIn"
//                 >
//                     <Feather 
//                         name="check-circle"
//                         color="green"
//                         size={20}
//                     />
//                 </Animatable.View>
//                 : null}
//             </View>

//             <Text style={[styles.text_footer, {
//                 marginTop: 35
//             }]}>Password</Text>
//             <View style={styles.action}>
//                 <Feather 
//                     name="lock"
//                     color="#05375a"
//                     size={20}
//                 />
//                 <TextInput 
//                     placeholder="Your Password"
//                     secureTextEntry={data.secureTextEntry ? true : false}
//                     style={styles.textInput}
//                     autoCapitalize="none"
//                     onChangeText={(val) => handlePasswordChange(val)}
//                 />
//                 <TouchableOpacity
//                     onPress={updateSecureTextEntry}
//                 >
//                     {data.secureTextEntry ? 
//                     <Feather 
//                         name="eye-off"
//                         color="grey"
//                         size={20}
//                     />
//                     :
//                     <Feather 
//                         name="eye"
//                         color="grey"
//                         size={20}
//                     />
//                     }
//                 </TouchableOpacity>
//             </View>

//             <Text style={[styles.text_footer, {
//                 marginTop: 35
//             }]}>Confirm Password</Text>
//             <View style={styles.action}>
//                 <Feather 
//                     name="lock"
//                     color="#05375a"
//                     size={20}
//                 />
//                 <TextInput 
//                     placeholder="Confirm Your Password"
//                     secureTextEntry={data.confirm_secureTextEntry ? true : false}
//                     style={styles.textInput}
//                     autoCapitalize="none"
//                     onChangeText={(val) => handleConfirmPasswordChange(val)}
//                 />
//                 <TouchableOpacity
//                     onPress={updateConfirmSecureTextEntry}
//                 >
//                     {data.secureTextEntry ? 
//                     <Feather 
//                         name="eye-off"
//                         color="grey"
//                         size={20}
//                     />
//                     :
//                     <Feather 
//                         name="eye"
//                         color="grey"
//                         size={20}
//                     />
//                     }
//                 </TouchableOpacity>
//             </View>
//             <View style={styles.textPrivate}>
//                 <Text style={styles.color_textPrivate}>
//                     By signing up you agree to our
//                 </Text>
//                 <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>{" "}Terms of service</Text>
//                 <Text style={styles.color_textPrivate}>{" "}and</Text>
//                 <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>{" "}Privacy policy</Text>
//             </View>
//             <View style={styles.button}>
//                 <TouchableOpacity
//                     style={styles.signIn}
//                     onPress={() => {}}
//                 >
//                 <LinearGradient
//                     colors={['#08d4c4', '#01ab9d']}
//                     style={styles.signIn}
//                 >
//                     <Text style={[styles.textSign, {
//                         color:'#fff'
//                     }]}>Sign Up</Text>
//                 </LinearGradient>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                     onPress={() => navigation.goBack()}
//                     style={[styles.signIn, {
//                         borderColor: '#009387',
//                         borderWidth: 1,
//                         marginTop: 15
//                     }]}
//                 >
//                     <Text style={[styles.textSign, {
//                         color: '#009387'
//                     }]}>Sign In</Text>
//                 </TouchableOpacity>
//             </View>
//             <Text style={{fontSize:16}}>
//                 User Name
//             </Text>
//             <TextInput 
//                     placeholder="Your Username"
//                     // style={styles.textInput}
//                     autoCapitalize="none"
//                     onChangeText={(val) => textInputChange(val)}
//                 />


//         </View>
//         <View style={{marginVertical:10}}>
//             <Text style={{fontSize:16}}>
//                 Email Address
//             </Text>
//             <TextInput 
                 
//             onChangeText={onChangeEmail}
//             value={email}

//             style={{borderBottomColor:"black",borderBottomWidth:2,width:windowWidth-30,innerHeight:1}}/>


//         </View>
//         <View style={{marginVertical:10}}>
//             <Text style={{fontSize:16}}>
//                 Password
//             </Text>
//          <View style={{flexDirection:'row',width:SCREEN_WIDTH}}>
//             <TextInput 
//                     placeholder="Your Password"
//                     secureTextEntry={data.secureTextEntry ? true : false}
//                     // style={styles.textInput}
//                     autoCapitalize="none"
//                     onChangeText={(val) => handlePasswordChange(val)}
//                 />
//                 <TouchableOpacity
//                     onPress={updateSecureTextEntry}
//                     style={{marginLeft:50}}
//                 >
//                     {data.secureTextEntry ? 
//                     <Feather 
//                         name="eye-off"
//                         color="grey"
//                         size={20}
//                     />
//                     :
//                     <Feather 
//                         name="eye"
//                         color="grey"
//                         size={20}
//                     />
//                     }
//                 </TouchableOpacity>

//                 </View>


//         </View>
//         <View style={{marginVertical:20}}>
//             <Text style={{fontSize:16}}>
//                Confirm  Password
//             </Text>
       
//             <TextInput     
//             onChangeText={onChangeConfirmPassword}
//             value={confirmPassword}
//             style={{borderBottomColor:"black",borderBottomWidth:2,width:windowWidth-30,innerHeight:1}}/>



//         </View>
//         <View style={{flexDirection:'column'}}>
//             <Text>DO you want to showcase your products and  Services or explore </Text>
//      <View style={{flexDirection:'row'}}> 
//       <View style={{flexDirection:'row'}}>
      
//                     <CheckBox
//           value={type=="business"}
//           onValueChange={()=>setType("business")}
//         />
//                     {/* <CheckBox /> */}
//                     <Text style={{marginVertical:5,fontWeight:'bold',color:'black',fontSize:15}}>Showcase  </Text>
//                 </View>
//                 <View style={{flexDirection:'row',alignContent:'flex-end'}}>
//                     <CheckBox
//           value={type=="client"}
//           onValueChange={()=>setType("client")}
//         />
//                     {/* <CheckBox /> */}
//                     <Text style={{marginVertical:5,fontWeight:'bold',color:'black',fontSize:15}}>Explore  </Text>
//                 </View>
//                 </View> 
//                 <View style={{flexDirection:'row',marginBottom:20}}>
//                     <CheckBox
//           value={type=="both"}
//           onValueChange={()=>setType("both")}
//         />
//                     {/* <CheckBox /> */}
//                     <Text style={{marginVertical:5,fontWeight:'bold',color:'black',fontSize:15}}>Showcase  And Explore </Text>
//                 </View>
//                 </View>
//         <TouchableOpacity onPressIn={()=>registerUser(email,password)}>
//         <View style={{width:windowWidth-20,backgroundColor:"#0077B5",height:windowHeight*0.06,borderRadius:50,alignItems:'center'}}>
//             <Text style={{fontSize:24,fontWeight:"bold",color:'white',marginVertical:5}}>
//                 Continue
//             </Text>
          
// </View>
// </TouchableOpacity>
// <View style={{alignSelf:'center',marginVertical:20}}>
//     <Text style={{fontWeight:'bold',color:'black',fontSize:24}}>
//         or
//     </Text>
// </View>
//                 <View style={{ width: windowWidth - 20, height: windowHeight * 0.06, borderRadius: 50, borderColor: 'black', borderWidth: 2, alignItems: 'center' }}>
                   
//                     <Text style={{ fontSize: 24, fontWeight: "bold", marginVertical: 5 }}>
//                     <Image source={GOOGLE}style={{ width: 30, height: 30}}/>    Continue with Google
//                     </Text>

//                 </View>


//         </View>
      
//       </View>
      
    );
  };


  const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#0077B5'    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor:'#0077B5'
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    color_textPrivate: {
        color: 'grey'
    },  errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
  });