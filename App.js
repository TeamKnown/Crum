import * as React from 'react'
import {Provider} from 'react-redux'
import store from './client/store'
import {Platform, View, Text, StyleSheet, Image} from 'react-native'
import {Router, Scene, Stack} from 'react-native-router-flux'
import NavigationBar from 'react-native-navbar'

import {devAxios} from './client/store'
import ScarletScreen from './client/components/MapScreen.js'
import ARScreen from './client/components/ARScreen'
import LoginScreen from './client/components/LoginScreen'

import UserProfile from './client/components/UserProfile'
import DropModal from './client/components/DropModal'

const styles = StyleSheet.create({
  boldText: {
    fontSize: 30,
    color: 'red'
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
})

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Scene key="root" tabs={true}>
            <Scene
              key="LoginScreen"
              component={LoginScreen}
              title="LoginScreen"
            />
            <Scene key="Profile" component={UserProfile} title="Profile" />
            <Scene key="AR" component={ARScreen} title="AR" />
            <Scene key="scarlet" component={ScarletScreen} title="Scarlet" />
            <Scene key="DropModal" component={DropModal} title="DropModal" />
            {/* <Scene key="gray" component={GrayScreen} title="Gray" /> */}
          </Scene>
        </Router>
      </Provider>
    )
  }
}
