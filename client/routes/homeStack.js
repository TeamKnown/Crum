import * as React from 'react'

import Ionicons from 'react-native-vector-icons/Ionicons'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import {MaterialCommunityIcons} from 'react-native-vector-icons'
import UserProfile from '../components/UserProfile'
import SignIn from '../components/Authentication/SignIn'
import SignUp from '../components/Authentication/SignUp'
import MapScreen from '../components/MapScreen/MapScreen'
import ARScreen from '../components/ARScreen/ARScreen'
import {createStackNavigator} from '@react-navigation/stack'

import {Dimensions} from 'react-native'

import {NavigationContainer} from '@react-navigation/native'
//the home screens after users login
const a = require('../../assets/crummap.png')
const Tab = createMaterialTopTabNavigator()
function HomeTabs(props) {
  const {height} = Dimensions.get('window')

  return (
    <NavigationContainer>
      <Tab.Navigator
        lazy={true}
        style={{paddingTop: height > 600 ? 30 : 5}}
        tabBarOptions={{
          activeTintColor: '#e91e63',
          showLabel: false,
          showIcon: true
        }}
      >
        <Tab.Screen
          name="Profile"
          component={UserProfile}
          options={{
            tabBarLabel: '',
            tabBarIcon: () => (
              <MaterialCommunityIcons name="account" color="#ccc" size={26} />
            )
          }}
        />
        <Tab.Screen
          name="ARScreen"
          component={ARScreen}
          options={{
            tabBarLabel: '',
            tabBarIcon: () => (
              <MaterialCommunityIcons name="camera" color="#ccc" size={26} />
            )
          }}
        />
        <Tab.Screen
          name="MapScreen"
          component={MapScreen}
          options={{
            tabBarLabel: '',
            tabBarIcon: () => (
              <MaterialCommunityIcons name={a} color="#ccc" size={26} />
            )
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

//login screen
const Stack = createStackNavigator()
function Signin() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
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
    </NavigationContainer>
  )
}

export {Signin, HomeTabs}
