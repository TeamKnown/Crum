import * as React from 'react'
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import {MaterialCommunityIcons} from 'react-native-vector-icons'
import UserProfile from '../components/UserProfile'
import SignIn from '../components/SignIn'
import SignUp from '../components/SignUp'
import MapScreen from '../components/MapScreen'
import ARScreen from '../components/ARScreen'
import {createStackNavigator} from '@react-navigation/stack'
import {createDrawerNavigator} from '@react-navigation/drawer'
import {Dimensions, View, TouchableOpacity} from 'react-native'
import Animated from 'react-native-reanimated'
//the home screens after users login

const Tab = createMaterialTopTabNavigator()
function HomeTabs() {
  const {height} = Dimensions.get('window')
  return (
    <Tab.Navigator style={{paddingTop: height > 600 ? 30 : 10}}>
      <Tab.Screen
        name="Profile"
        component={UserProfile}
        options={{
          tabBarLabel: 'Profile'
        }}
      />
      <Tab.Screen
        name="ARScreen"
        component={ARScreen}
        options={{
          tabBarLabel: 'ARView'
        }}
      />
      <Tab.Screen
        name="MapScreen"
        component={MapScreen}
        options={{
          tabBarLabel: 'MapView'
        }}
      />
    </Tab.Navigator>
  )
}

//login screen
const Stack = createStackNavigator()
function Signin() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{headerTransparent: true, title: ''}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{headerTransparent: true, title: ''}}
      />
    </Stack.Navigator>
  )
}
export {Signin, HomeTabs}
