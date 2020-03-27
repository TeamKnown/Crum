/* eslint-disable complexity */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavigationContainer} from '@react-navigation/native'
import {HomeTabs, Signin} from './routes/homeStack'
import {me, getCurrentPosition, stopTracking} from './store'
import {TouchableWithoutFeedback} from 'react-native-gesture-handler'
import {Keyboard, Text, View, Linking, TouchableOpacity} from 'react-native'
import * as Permissions from 'expo-permissions'
import PermissionModal from '../client/components/PermissionModal'

const DismissKeyBoard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)
/**
 * COMPONENT
 */
class disRoutes extends Component {
  state = {
    errorMessage: null,
    isGranted: null
  }

  requestLocationPermission = async () => {
    let {status, expires} = await Permissions.askAsync(Permissions.LOCATION)
    console.log('PERMISSION DENIED', status)
    console.log('PERMIS.EXPIRES', expires)
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
        isGranted: false
      })

      // return <PermissionModal status={status}/>
    } else {
      this.props.subscribeToLocationData()
      console.log('PERMISSION GRANTED', status)
    }
  }

  // componentWillMount() {
  //   this.requestLocationPermission()
  // }

  closeModal() {
    this.setState({isGranted: true})
  }

  componentDidMount() {
    this.requestLocationPermission()
    this.props.loadInitialData()
  }
  componentWillUnmount = () => {
    this.props.unsubscribeToLocationData()
    // console.log('UNMOUNTING THE ERROR MESSAGE')
  }

  render() {
    const {isLoggedIn} = this.props
    console.log('UNMOUNTING THE ERROR MESSAGE', this.state.errorMessage)

    // if (this.state.errorMessage) {
    //   return (
    //     <PermissionModal/>
    //   )
    // }
    return (
      <PermissionModal
        isGranted={this.state.isGranted}
        // closeModal={this.closeModal}
      />
    )

    // return (
    //   <NavigationContainer>
    //     {isLoggedIn ? <HomeTabs /> : <Signin />}
    //   </NavigationContainer>
    // )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id,
    user: state.user
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
    },
    subscribeToLocationData: () => {
      dispatch(getCurrentPosition())
    },
    unsubscribeToLocationData: () => {
      dispatch(stopTracking())
    }
  }
}

const Routes = connect(mapState, mapDispatch)(disRoutes)

export default Routes
