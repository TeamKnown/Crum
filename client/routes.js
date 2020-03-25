/* eslint-disable complexity */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavigationContainer} from '@react-navigation/native'
import {HomeTabs, Signin} from './routes/homeStack'
import {me} from './store'
import {TouchableWithoutFeedback} from 'react-native-gesture-handler'
import {Keyboard} from 'react-native'

const DismissKeyBoard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)
/**
 * COMPONENT
 */
class disRoutes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }
  render() {
    const {isLoggedIn} = this.props

    return (
      <NavigationContainer>
        {isLoggedIn ? <HomeTabs /> : <Signin />}
      </NavigationContainer>
    )
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
    }
  }
}

const Routes = connect(mapState, mapDispatch)(disRoutes)

export default Routes
