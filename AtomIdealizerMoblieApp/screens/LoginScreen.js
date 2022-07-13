import React, { useContext } from "react";
import { View,Text, TouchableOpacity,SafeAreaView, Dimensions ,Image} from "react-native";
import CheckBox from '@react-native-community/checkbox';
import { TextInput } from "react-native-gesture-handler";
import { useState } from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from "./AuthContext";

// import windowWidth from '../utils/Dimensions'
export default  LoginScreen = ({ navigation }) => {

    const windowWidth=Dimensions.get("screen").width
    const windowHeight=Dimensions.get("screen").height

    const GOOGLE= require("../assets/images/google.png");

    const {login}=useContext(AuthContext)
    const[password,onChangePassword]=useState("")

    const[email,onChangeEmail]=useState("")
    const [text, setText] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(true);
    const [isSelected, setSelection] = useState(false);
    return (
        <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: 'white' }}>
            <View style={{ justifyContent: "flex-start", marginHorizontal: 10, marginTop: 20 }}>
                <View>
                    <Text style={{ fontSize: 30, fontWeight: "bold", color: 'black', fontFamily: "Josefin Sans" }}>
                        Sign In
                    </Text>


                </View>

                <View style={{ marginVertical: 10 }}>
                    <Text style={{ fontSize: 16 }}>
                        Email Address
                    </Text>
                    <TextInput

                        onChangeText={onChangeEmail}
                        value={email}
                        style={{ borderBottomColor: "black", borderBottomWidth: 2, width: windowWidth - 20, innerHeight: 1 }} />


                </View>
                <View style={{ marginVertical: 10 }}>
                    <Text style={{ fontSize: 16 }}>
                        Password
                    </Text>
                    <SafeAreaView>
                        <TextInput
                            onChangeText={onChangePassword}
                            value={password}
                            style={{ borderBottomColor: "black", borderBottomWidth: 2, width: windowWidth - 20, innerHeight: 1 }} />
                       
                    </SafeAreaView>

                </View>
                <View style={{flexDirection:'row',marginBottom:20}}>
                    <CheckBox
          value={isSelected}
          onValueChange={setSelection}
        />
                    {/* <CheckBox /> */}
                    <Text style={{marginVertical:5,fontWeight:'bold',color:'black',fontSize:15}}>Remember Me </Text>
                </View>
                <View style={{marginBottom:10}}>
                    <Text>Forgot Password?</Text>
                </View>
                <TouchableOpacity onPress={()=>login(email,password)}>
                    {/* green color #0077B5  */}
                <View style={{ width: windowWidth - 20, backgroundColor: "#0077B5", height: windowHeight * 0.06, borderRadius: 50, alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: "bold", color: 'white', marginVertical: 5 }}>
                        Continue
                    </Text>
                 
                </View>
                </TouchableOpacity>
                <View style={{ alignSelf: 'center', marginVertical: 20 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 24, color: 'black' }}>
                        or
                    </Text>
                </View>
                <View style={{ width: windowWidth - 20, height: windowHeight * 0.06, borderRadius: 50, borderColor: 'black', borderWidth: 2, alignItems: 'center' }}>

                    <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 5 }}>
                        <Image source={GOOGLE} style={{ width: 30, height: 30 }} />    Continue with Google
                    </Text>

                </View>
                <View style={{alignItems:'center',marginVertical:20}}>
                <TouchableOpacity onPress={()=>navigation.navigate("SignUp")}>
                                <Text  style={{fontSize:16,fontWeight:'bold'}}>
                   New to ShopMedia ?   <Text style={{fontSize:16,fontWeight:"bold",color:'#0077B5',fontFamily:"Josefin Sans"}}>
                   Join ShopMedia
                    </Text>
                    
                </Text>
                </TouchableOpacity>
                </View>

            </View>

        </View>
      
    );
  };
//   const feedStyle = StyleSheet.create({
//     listContainer: {
//       flex: 1,
//       backgroundColor: '#61dafb',
//     },
//     listItem: {
//       fontStyle: 'italic',
//       fontWeight: 'bold'
//     },
//   });
  