/* eslint-disable react/display-name */
import * as React from 'react'

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import {MaterialCommunityIcons} from 'react-native-vector-icons'
import UserProfile from '../components/UserScreen/UserProfile'
import SignIn from '../components/Authentication/SignIn'
import SignUp from '../components/Authentication/SignUp'
import MapScreen from '../components/MapScreen/MapScreen'
import ARScreen from '../components/ARScreen/ARScreen'
import {createStackNavigator} from '@react-navigation/stack'

import {Dimensions, Image} from 'react-native'

import {NavigationContainer} from '@react-navigation/native'
//the home screens after users login

const Tab = createMaterialTopTabNavigator()
function HomeTabs() {
  const {height} = Dimensions.get('screen')
  return (
    <NavigationContainer>
      <Tab.Navigator
        lazy={true}
        tabBarOptions={{
          tabStyle: {
            padding: height > 890 ? 50 : 20,

            height: height > 890 ? 90 : 60
          },

          showLabel: false,
          showIcon: true
        }}
      >
        <Tab.Screen
          name="Profile"
          component={UserProfile}
          options={{
            tabBarLabel: '',
            style: {backgroundColor: 'powderblue'},
            tabBarIcon: focused => (
              <MaterialCommunityIcons
                name="account-circle-outline"
                color={focused.focused ? '#7C1E9F' : '#ccc'}
                size={26}
              />
            )
          }}
        />

        <Tab.Screen
          name="ARScreen"
          component={ARScreen}
          options={{
            tabBarLabel: '',
            tabBarIcon: focused => (
              <MaterialCommunityIcons
                name="camera"
                color={focused.focused ? '#7C1E9F' : '#ccc'}
                size={26}
              />
            )
          }}
        />
        <Tab.Screen
          name="MapScreen"
          component={MapScreen}
          options={{
            tabBarLabel: '',
            tabBarIcon: focused => (
              <Image
                source={require('../../assets/crummap.png')}
                fadeDuration={0}
                style={{
                  width: 21,
                  height: 21,
                  tintColor: focused.focused ? '#7C1E9F' : '#ccc'
                }}
              />
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
