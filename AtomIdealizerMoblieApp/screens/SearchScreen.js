import * as React from 'react';
import { View, Text } from 'react-native';
import { AuthContext } from './AuthContext';
export default function SearchScreen({ navigation }) {
    const {user,logout}=React.useContext(AuthContext)
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => alert('This is the "Home" screen.')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Welcome {user.uid}</Text>
            {/* <NOTIFICATION/> */}
          
              
        <View style={{backgroundColor:"#3C4DEB",borderRadius:50,alignItems:'center'}}>
            <Text onPress={()=>logout()} style={{fontSize:24,fontWeight:"bold",color:'white',marginVertical:20}}>
                Continue
            </Text>
          
</View>

        </View>
    );
}