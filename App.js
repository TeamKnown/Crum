import * as React from 'react'
import {Provider} from 'react-redux'
import store from './client/store'
import {Platform, View, Text, StyleSheet, Image} from 'react-native'

import Routes from './client/routes'
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
  constructor(props) {
    super(props)

    this.state = {
      signedIn: false,
      checkedSignIn: false
    }
  }
  render() {
    return (
      <Provider store={store}>
        <Routes />
      </Provider>
    )
  }
}
