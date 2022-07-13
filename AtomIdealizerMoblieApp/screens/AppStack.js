import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Text, View } from 'react-native';
import AddPostScreen from './AddPostScreen';
import BottomNavigationTab from './BottomNavigationTab';
import EditProfileScreen from './EditProfile';
import EditProfile from './EditProfile';
import ProductScreen from './ProductScreen';
export default function AppStack(){
    const AppStack=createStackNavigator()

    return(
        <AppStack.Navigator
        initialRouteName='BottomTabNavigation'>
       
         <AppStack.Screen
          name="BottomTabNavigation"
          component={BottomNavigationTab}
          options={{ title: '',headerShown:false }}
        /> 
        <AppStack.Screen
        name="Product"
        component={ProductScreen}
        options={{ title: '' }}
      />
       <AppStack.Screen
        name="addPost"
        component={AddPostScreen}
        options={{ title: 'Post Product' , headerTitleAlign:"center"
          }}
      />
       <AppStack.Screen
        name="editProfile"
        component={EditProfileScreen}
        options={{ title: 'Post Product' , headerTitleAlign:"center"
          }}
      />
     
      
      </AppStack.Navigator>
    )
}