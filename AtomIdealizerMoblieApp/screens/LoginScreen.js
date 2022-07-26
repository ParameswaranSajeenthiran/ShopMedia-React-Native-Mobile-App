// import React, { useContext } from "react";
// import { View,Text, TouchableOpacity,SafeAreaView, Dimensions ,Image} from "react-native";
// import CheckBox from '@react-native-community/checkbox';
// import { TextInput } from "react-native-gesture-handler";
// import { useState } from "react";
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { AuthContext } from "./AuthContext";

// // import windowWidth from '../utils/Dimensions'
// export default  LoginScreen = ({ navigation }) => {

//     const windowWidth=Dimensions.get("screen").width
//     const windowHeight=Dimensions.get("screen").height

//     const GOOGLE= require("../assets/images/google.png");

//     const {login}=useContext(AuthContext)
//     const[password,onChangePassword]=useState("")

//     const[email,onChangeEmail]=useState("")
//     const [text, setText] = useState('');
//     const [passwordVisible, setPasswordVisible] = useState(true);
//     const [isSelected, setSelection] = useState(false);
//     return (
//         <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: 'white' }}>
//             <View style={{ justifyContent: "flex-start", marginHorizontal: 10, marginTop: 20 }}>
//                 <View>
//                     <Text style={{ fontSize: 30, fontWeight: "bold", color: 'black', fontFamily: "Josefin Sans" }}>
//                         Sign In
//                     </Text>


//                 </View>

//                 <View style={{ marginVertical: 10 }}>
//                     <Text style={{ fontSize: 16 }}>
//                         Email Address
//                     </Text>
//                     <TextInput

//                         onChangeText={onChangeEmail}
//                         value={email}
//                         style={{ borderBottomColor: "black", borderBottomWidth: 2, width: windowWidth - 20, innerHeight: 1 }} />


//                 </View>
//                 <View style={{ marginVertical: 10 }}>
//                     <Text style={{ fontSize: 16 }}>
//                         Password
//                     </Text>
//                     <SafeAreaView>
//                         <TextInput
//                             onChangeText={onChangePassword}
//                             value={password}
//                             style={{ borderBottomColor: "black", borderBottomWidth: 2, width: windowWidth - 20, innerHeight: 1 }} />
                       
//                     </SafeAreaView>

//                 </View>
//                 <View style={{flexDirection:'row',marginBottom:20}}>
//                     <CheckBox
//           value={isSelected}
//           onValueChange={setSelection}
//         />
//                     {/* <CheckBox /> */}
//                     <Text style={{marginVertical:5,fontWeight:'bold',color:'black',fontSize:15}}>Remember Me </Text>
//                 </View>
//                 <View style={{marginBottom:10}}>
//                     <Text>Forgot Password?</Text>
//                 </View>
//                 <TouchableOpacity onPress={()=>login(email,password)}>
//                     {/* green color #0077B5  */}
//                 <View style={{ width: windowWidth - 20, backgroundColor: "#0077B5", height: windowHeight * 0.06, borderRadius: 50, alignItems: 'center' }}>
//                     <Text style={{ fontSize: 24, fontWeight: "bold", color: 'white', marginVertical: 5 }}>
//                         Continue
//                     </Text>
                 
//                 </View>
//                 </TouchableOpacity>
//                 <View style={{ alignSelf: 'center', marginVertical: 20 }}>
//                     <Text style={{ fontWeight: 'bold', fontSize: 24, color: 'black' }}>
//                         or
//                     </Text>
//                 </View>
//                 <View style={{ width: windowWidth - 20, height: windowHeight * 0.06, borderRadius: 50, borderColor: 'black', borderWidth: 2, alignItems: 'center' }}>

//                     <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 5 }}>
//                         <Image source={GOOGLE} style={{ width: 30, height: 30 }} />    Continue with Google
//                     </Text>

//                 </View>
//                 <View style={{alignItems:'center',marginVertical:20}}>
//                 <TouchableOpacity onPress={()=>navigation.navigate("SignUp")}>
//                                 <Text  style={{fontSize:16,fontWeight:'bold'}}>
//                    New to ShopMedia ?   <Text style={{fontSize:16,fontWeight:"bold",color:'#0077B5',fontFamily:"Josefin Sans"}}>
//                    Join ShopMedia
//                     </Text>
                    
//                 </Text>
//                 </TouchableOpacity>
//                 </View>

//             </View>

//         </View>
      
//     );
//   };
// //   const feedStyle = StyleSheet.create({
// //     listContainer: {
// //       flex: 1,
// //       backgroundColor: '#61dafb',
// //     },
// //     listItem: {
// //       fontStyle: 'italic',
// //       fontWeight: 'bold'
// //     },
// //   });

import React, { useEffect } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
    Alert,
    Image
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification, {Importance} from 'react-native-push-notification';
import { useTheme } from 'react-native-paper';

import { AuthContext } from "./AuthContext";
import GetLocation from 'react-native-get-location';
// import Users from '../model/users';

const SignInScreen = ({navigation}) => {
    useEffect(()=>{
        createChannel()
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
          })
          .then(location => {
            console.log(location);
            // setUserData({...userData,location:{latitude:location.latitude,longitude:location.longitude}})
            setLocation({latitude:location.latitude,longitude:location.longitude})
            AsyncStorage.setItem("location",JSON.stringify(location))
          
          })
          .catch(error => {
            const { code, message } = error;
            console.warn(code, message);
          })
    },[])
    useEffect(()=>{
        createChannel();
    },[])
    const [data, setData] = React.useState({
        username: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
    });

    const { colors } = useTheme();

    const { login } = React.useContext(AuthContext);

    const createChannel=()=>{
        PushNotification.createChannel(
          {
            channelId: "channel-id", // (required)
            channelName: "My channel", // (required)
            channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
            playSound: true, // (optional) default: true
            soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
            importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
          },
          (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
      }
    const textInputChange = (val) => {
        if( val.trim().length >= 4 ) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false,
                isValidUser: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        if( val.trim().length >= 8 ) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const handleValidUser = (val) => {
        if( val.trim().length >= 4 ) {
            setData({
                ...data,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                isValidUser: false
            });
        }
    }

    const loginHandle = (userName, password) => {

        // const foundUser = Users.filter( item => {
        //     return userName == item.username && password == item.password;
        // } );

        if ( data.username.length == 0 || data.password.length == 0 ) {
            Alert.alert('Wrong Input!', 'Username or password field cannot be empty.', [
                {text: 'Okay'}
            ]);
            return;
        }

        // if ( foundUser.length == 0 ) {
        //     Alert.alert('Invalid User!', 'Username or password is incorrect.', [
        //         {text: 'Okay'}
        //     ]);
        //     return;
        // }
        login(data.username,data.password);
    }

    return (
      <View style={styles.container}>
          <StatusBar backgroundColor='#0077B5' barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>Welcome!</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={[styles.footer, {
                backgroundColor: colors.background
            }]}
        >
            <Text style={[styles.text_footer, {
                color: colors.text
            }]}>Username</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color={colors.text}
                    size={20}
                />
                <TextInput 
                    placeholder="Your Username"
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
                    autoCapitalize="none"
                    onChangeText={(val) => textInputChange(val)}
                    onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
                />
                {data.check_textInputChange ? 
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
            { data.isValidUser ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Username must be 4 characters long.</Text>
            </Animatable.View>
            }
            

            <Text style={[styles.text_footer, {
                color: colors.text,
                marginTop: 35
            }]}>Password</Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    color={colors.text}
                    size={20}
                />
                <TextInput 
                    placeholder="Your Password"
                    placeholderTextColor="#666666"
                    secureTextEntry={data.secureTextEntry ? true : false}
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
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
            </View>
            { data.isValidPassword ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Password must be 8 characters long.</Text>
            </Animatable.View>
            }
            

            <TouchableOpacity>
                <Text style={{color: '#009387', marginTop:15}}>Forgot password?</Text>
            </TouchableOpacity>
            <View style={styles.button}>
                <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => {loginHandle( data.username, data.password )}}
                >
                <View
                    
                    style={styles.signIn}
                >
                    <Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>Login To Business Account</Text>
                </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.signIn}
                    onPress={() => {loginHandle( data.username, data.password )}}
                >
                <View
                    
                    style={styles.signIn}
                >
                    <Text style={[styles.textSign, {
                        color:'#fff'
                    }]}>Login To Customer Account</Text>
                </View>
                </TouchableOpacity>
                <View style={{flexDirection:'row'}}>
             <Image style={{width:50,height:50,marginHorizontal:10}} source={require('../assets/images/google.png')}/>
              <Image style={{width:50,height:50,marginHorizontal:10}} source={require('../assets/images/meta.png')}/>
              </View>
                <View style={styles.textPrivate}>
              <Text style={styles.color_textPrivate}>
                  New to ShopMEdia?
              </Text>
       
          </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('SignUp')}
                    style={[styles.signIn, {
                        borderColor: '#009387',
                        borderWidth: 1,
                        backgroundColor:'white',
                        marginTop: 15
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color: '#009387'
                    }]}>Register Now</Text>
                </TouchableOpacity>
            </View>
        </Animatable.View>
      </View>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#0077B5'     },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
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
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
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
        marginVertical:10,
        backgroundColor:'#0077B5'
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
  });