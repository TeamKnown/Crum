/* eslint-disable complexity */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavigationContainer} from '@react-navigation/native'
import {HomeTabs, Signin} from './routes/homeStack'
import {me, getCurrentPosition, stopTracking} from './store'
import {TouchableWithoutFeedback} from 'react-native-gesture-handler'
import {Keyboard, View, StyleSheet} from 'react-native'
import * as Permissions from 'expo-permissions'
import PermissionModal from '../client/components/PermissionModal'

import IntroImages from './components/Intro/IntroImages'
import IntroGradient from './components/Intro/IntroGradient'

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
    isGranted: true,
    show_Main_App: false
  }

  // Intro slides stuff
  onDoneAllSlides = () => {
    this.setState({show_Main_App: true})
  }
  onSkipSlides = () => {
    this.setState({show_Main_App: true})
  }

  // Permission modal stuff
  requestLocationPermission = async () => {
    let {status} = await Permissions.askAsync(Permissions.LOCATION)

    if (status !== 'granted') {
      let {permissions} = await Permissions.askAsync(Permissions.LOCATION)
      console.log(permissions)
      this.setState({
        isGranted: false
      })
    } else {
      this.props.subscribeToLocationData()
    }
  }

  closeModal = () => {
    this.setState({isGranted: true})
  }

  componentDidMount() {
    this.requestLocationPermission()
    this.props.loadInitialData()
  }

  componentWillUnmount = () => {
    this.props.unsubscribeToLocationData()
  }

  render() {
    const {isLoggedIn} = this.props

    if (this.state.show_Main_App) {
      if (isLoggedIn) {
        return <HomeTabs user={this.props.user} />
      } else {
        return (
          <View style={{flex: 1}}>
            <Signin />
            <PermissionModal
              isGranted={this.state.isGranted}
              closeModal={this.closeModal}
            />
          </View>
        )
      }
      // Otherwise not logged in, show the intro slides
    } else {
      return (
        <IntroGradient
          onDone={() => this.onDoneAllSlides()}
          onSkip={() => this.onSkipSlides()}
        />
      )
    }
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
