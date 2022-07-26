import { StyleSheet } from "react-native";
import { SCREEN_HEIGHT } from "../utils/Dimensions";
import { SCREEN_WIDTH } from "../utils/Dimensions";

export default StyleSheet.create({
card:{


marginVertical:20,
borderRadius:50,



},
userInfo:{
    flexDirection:'row',
    
   

},
userImg:{
    width:SCREEN_HEIGHT*0.05,
    height:SCREEN_HEIGHT*0.05,
    borderRadius:50

},userName:{
marginLeft:10,
flexDirection:'column'
},
userNameText:{
    fontWeight:"bold",
    color:"black"
},
options:{
 alignSelf:'flex-end',
 justifyContent:"flex-start"
},
postImage:{
    marginVertical:10,
    width:SCREEN_WIDTH-2,
    height:SCREEN_HEIGHT*0.4
}, linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  postDescription:{

  },
  heading:{
    fontSize:24,
    color:'white',
    fontWeight:'bold',
    
  },
  description:{
   fontSize:16,
       color:'white',
    fontWeight:'bold',

  },
  rating:{
flexDirection:'row'

  },
  star:{

  },
  detail:{
    position:'relative',
  }
})