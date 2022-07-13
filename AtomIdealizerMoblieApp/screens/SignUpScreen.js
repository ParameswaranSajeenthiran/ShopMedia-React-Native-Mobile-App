import React, { useContext } from "react";
import { View,Text, TouchableOpacity,SafeAreaView, Dimensions ,Image} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useState } from "react";
import { AuthContext } from "./AuthContext";
// import MaterialIcon, {colorPalette} from 'material-icons-react';

// import windowWidth from '../utils/Dimensions'
export default  LoginScreen = ({ navigation }) => {

    const windowWidth=Dimensions.get("screen").width
    const windowHeight=Dimensions.get("screen").height

    const GOOGLE= require("../assets/images/google.png");

    const{register} =useContext(AuthContext);

    const[email,onChangeEmail]=useState("")
    const[password,onChangePassword]=useState("")
    const [text, setText] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(true);
    return (
      <View  style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start',backgroundColor:'white' }}>
        <View style={{justifyContent:"flex-start",marginHorizontal:10,marginTop:20}}>
            <View>
                <Text style={{fontSize:30,fontWeight:"bold",color:'black',fontFamily:"Josefin Sans"}}>
                    Join ShopMedia
                </Text>
                <TouchableOpacity onPress={()=>navigation.navigate("Login")}>
                                <Text  style={{fontSize:24,color:'black',  fontFamily:"Josefin Sans"}}>
                    or   <Text style={{fontSize:24,fontWeight:"",color:'#0077B5',fontFamily:"Josefin Sans"}}>
                   sign in
                    </Text>
                    
                </Text>
                </TouchableOpacity>
            
        </View>
     
        <View style={{marginVertical:10}}>
            <Text style={{fontSize:16}}>
                Email Address
            </Text>
            <TextInput 
                 
            onChangeText={onChangeEmail}
            value={email}

            style={{borderBottomColor:"black",borderBottomWidth:2,width:windowWidth-30,innerHeight:1}}/>


        </View>
        <View style={{marginVertical:10}}>
            <Text style={{fontSize:16}}>
                Password
            </Text>
         
            <TextInput     
            onChangeText={onChangePassword}
            value={password}
            secureTextEntry={false}

            style={{borderBottomColor:"black",borderBottomWidth:2,width:windowWidth-30,innerHeight:1}}/>

      


        </View>
        <View style={{marginVertical:20}}>
            <Text style={{fontSize:16}}>
               Confirm  Password
            </Text>
       
            <TextInput     
            onChangeText={onChangeEmail}
            value={email}
            style={{borderBottomColor:"black",borderBottomWidth:2,width:windowWidth-30,innerHeight:1}}/>



        </View>
        <TouchableOpacity onPressIn={()=>register(email,password)}>
        <View style={{width:windowWidth-20,backgroundColor:"#0077B5",height:windowHeight*0.06,borderRadius:50,alignItems:'center'}}>
            <Text style={{fontSize:24,fontWeight:"bold",color:'white',marginVertical:5}}>
                Continue
            </Text>
          
</View>
</TouchableOpacity>
<View style={{alignSelf:'center',marginVertical:20}}>
    <Text style={{fontWeight:'bold',color:'black',fontSize:24}}>
        or
    </Text>
</View>
                <View style={{ width: windowWidth - 20, height: windowHeight * 0.06, borderRadius: 50, borderColor: 'black', borderWidth: 2, alignItems: 'center' }}>
                   
                    <Text style={{ fontSize: 24, fontWeight: "bold", marginVertical: 5 }}>
                    <Image source={GOOGLE}style={{ width: 30, height: 30}}/>    Continue with Google
                    </Text>

                </View>


        </View>
      
      </View>
      
    );
  };
