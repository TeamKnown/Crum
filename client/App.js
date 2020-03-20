import * as React from 'react'
import {Platform, View, Text, StyleSheet, Image} from 'react-native'
import {Router, Scene, Stack} from 'react-native-router-flux'
import NavigationBar from 'react-native-navbar'

import ScarletScreen from './components/MapScreen.js'
// import GrayScreen from './components/GrayScreen'
import ARScreen from './components/ARScreen'

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
    const TabIcon = ({selected, title}) => {
      return <Text style={{color: selected ? 'red' : 'black'}}>{title}</Text>
    }

    return (
      <Router>
        <Scene key="root" tabs={true}>
          {/* <Scene key="AR" component={ARScreen} title="AR" /> */}
          <Scene key="scarlet" component={ScarletScreen} title="Scarlet" />
          {/* <Scene key="gray" component={GrayScreen} title="Gray" /> */}
        </Scene>
      </Router>
    )
  }
}
