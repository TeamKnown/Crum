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

//the home screens after users login
const Tab = createMaterialTopTabNavigator()
function HomeTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      activeColor="#e91e63"
      style={{backgroundColor: 'tomato'}}
    >
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
          tabBarLabel: 'ARScreen'
        }}
      />
      <Tab.Screen
        name="MapScreen"
        component={MapScreen}
        options={{
          tabBarLabel: 'MapScreen'
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
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  )
}
export {Signin, HomeTabs}
