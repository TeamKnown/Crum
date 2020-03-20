import * as React from 'react'
import {Provider} from 'react-redux'
import store from './store'
import {Platform, View, Text, StyleSheet, Image} from 'react-native'
import {Router, Scene, Stack} from 'react-native-router-flux'
import NavigationBar from 'react-native-navbar'
import {devAxios} from './store'
import ScarletScreen from './components/MapScreen.js'
import ARScreen from './components/ARScreen'
import LoginScreen from './components/LoginScreen'

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
  // componentDidMount = async () => {
  //   this.props.fetchInitialData()
  // }
  // componentWillUnmount = () => {
  //   this.props.unFetchInitialData()
  // }
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
            <Scene key="AR" component={ARScreen} title="AR" />
            <Scene key="scarlet" component={ScarletScreen} title="Scarlet" />
            {/* <Scene key="gray" component={GrayScreen} title="Gray" /> */}
          </Scene>
        </Router>
      </Provider>
    )
  }
}
