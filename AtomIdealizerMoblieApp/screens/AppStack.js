import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Text, View } from 'react-native';
import AddPostScreen from './AddPostScreen';
import AddProfile from './AddProfile';
import BottomNavigationTab from './BottomNavigationTab';
import BusinessProfileScreen from './BusineesProfilleScreen';
import businessProfileScreen from './BusineesProfilleScreen';
import BusinessFeedScreen from './BusinessFeeedScreen'
import EditProfileScreen from './EditProfile';
import EditProfile from './EditProfile';
import ProductScreen from './ProductScreen';
export default function AppStack(){
    const AppStack=createStackNavigator()

    return(
        <AppStack.Navigator
        initialRouteName='AddProfileScreen'>
       
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
        options={{ title:'',headerBackTitle:'cancel'
          }}
      />
       <AppStack.Screen
        name="editProfile"
        component={EditProfileScreen}
        options={{ title: 'Post Product' , headerTitleAlign:"center",
          }}
      />
       <AppStack.Screen
        name="businessProfileScreen"
        component={BusinessProfileScreen}
        options={{ title: 'Business Profile Screen' , headerTitleAlign:"center"
          }}
      />
      <AppStack.Screen
        name="BusinessFeedScreen"
        component={BusinessFeedScreen}
        options={{ title: 'Business Profile Screen' , headerTitleAlign:"center"
          }}
      />
       <AppStack.Screen
        name="AddProfileScreen"
        component={AddProfile}
        options={{ title: 'Business Profile Screen' , headerTitleAlign:"center"
          }}
      />
     
      
      </AppStack.Navigator>
    )
}