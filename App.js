import React, {useState} from 'react'
import {Provider} from 'react-redux'
import store from './client/store'
import {Platform, View, Text, StyleSheet, Image} from 'react-native'
import * as Font from 'expo-font'
import Routes from './client/routes'
import {fonts} from './assets'
import {AppLoading, SplashScreen} from 'expo'
import {Asset} from 'expo-asset'
import {Ionicons} from '@expo/vector-icons'
import useLinking from './client/routes/useLinking'
console.disableYellowBox = true
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

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image)
    } else {
      return Asset.fromModule(image).downloadAsync()
    }
  })
}

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false)
  const [initialNavigationState, setInitialNavigationState] = React.useState()
  const containerRef = React.useRef()
  const {getInitialState} = useLinking(containerRef)

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide()

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState())
        //load images
        await cacheImages([require('./assets/background.png')])
        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          FuturaBold: require('./assets/fonts/FuturaBold.ttf'),
          FuturaBoldE: require('./assets/fonts/FuturaExtra.ttf'),
          FuturaBoldI: require('./assets/fonts/FuturaBoldItalic.ttf'),
          KenyanCoffee: require('./assets/fonts/kenyancoffeerg.ttf'),
          FuturistFixedwidthBold: require('./assets/fonts/FuturistFixedwidthBold.ttf'),
          APompadour: require('./assets/fonts/APompadour.ttf'),
          APompadourBold: require('./assets/fonts/APompadourBold.ttf')
        })
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e)
      } finally {
        setLoadingComplete(true)
        SplashScreen.hide()
      }
    }

    loadResourcesAndDataAsync()
  }, [])

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return <AppLoading />
  } else {
    return (
      <Provider store={store}>
        <Routes />
      </Provider>
    )
  }
}
