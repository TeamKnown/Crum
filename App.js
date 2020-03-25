import React, {useState} from 'react'
import {Provider} from 'react-redux'
import store from './client/store'
import {Platform, View, Text, StyleSheet, Image} from 'react-native'
import * as Font from 'expo-font'
import Routes from './client/routes'
import {fonts} from './assets'
import {AppLoading} from 'expo'
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
const getAssets = () =>
  Font.loadAsync({
    FuturaBold: require('./assets/fonts/FuturaBold.ttf'),
    FuturaBoldE: require('./assets/fonts/FuturaExtra.ttf')
  })

export default function App() {
  const [assetsLoaded, setAssetsLoaded] = useState(false)
  console.log(assetsLoaded)
  if (assetsLoaded) {
    return (
      <Provider store={store}>
        <Routes />
      </Provider>
    )
  } else {
    return (
      <AppLoading
        startAsync={getAssets}
        onFinish={() => setAssetsLoaded(true)}
      />
    )
  }
}
