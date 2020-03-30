import * as React from 'react'
import {useState, useEffect} from 'react'
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import {MaterialCommunityIcons} from 'react-native-vector-icons'
import UserProfile from '../components/UserProfile'
import SignIn from '../components/Authentication/SignIn'
import SignUp from '../components/Authentication/SignUp'
import MapScreen from '../components/MapScreen/MapScreen'
import ARScreen from '../components/ARScreen/ARScreen'
import {createStackNavigator} from '@react-navigation/stack'
import {createDrawerNavigator} from '@react-navigation/drawer'
import {Dimensions, View, TouchableOpacity} from 'react-native'
import Animated from 'react-native-reanimated'
import {NavigationContainer} from '@react-navigation/native'
import {connect} from 'react-redux'
import {getSingleUser, fetchUserCrumInstances} from '../store'
//the home screens after users login

const Tab = createMaterialTopTabNavigator()
function DisHomeTabs(props) {
  const {height} = Dimensions.get('window')
  const [user, setUser] = useState(props.user)

  useEffect(() => {
    props.getSingleUser(props.user.id)
  }, props.user)

  return (
    <NavigationContainer>
      <Tab.Navigator lazy={true} style={{paddingTop: height > 600 ? 30 : 10}}>
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

const mapState = state => {
  return {
    user: state.user
  }
}

const mapDispatch = dispatch => {
  return {
    getSingleUser: id => dispatch(getSingleUser(id))
  }
}

const HomeTabs = connect(mapState, mapDispatch)(DisHomeTabs)

export {Signin, HomeTabs}
