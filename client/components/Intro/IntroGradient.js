import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider'
import {LinearGradient} from 'expo-linear-gradient'
import Ionicons from 'react-native-vector-icons/Ionicons'

const slides = [
  {
    key: 'firstSlide',
    title: 'This is Crum!',
    text:
      'React-native-app-intro-slider is easy to setup with a small footprint and no dependencies. And it comes with good default layouts!',
    icon: 'ios-images',
    colors: ['#63E2FF', '#B066FE']
  },
  {
    key: 'secondSlide',
    title: 'Super customizable',
    text:
      'The component is also super customizable, so you can adapt it to cover your needs and wants.',
    icon: 'ios-options',
    colors: ['#A3A1FF', '#3A3897']
  },
  {
    key: 'thirdSlide',
    title: 'No need to buy me beer',
    text: 'Usage is all free',
    icon: 'ios-beer',
    colors: ['#29ABE2', '#4F00BC']
  }
]

const _renderNextButton = () => {
  return (
    <View style={styles.buttonCircle}>
      <Ionicons
        name="md-arrow-round-forward"
        color="rgba(255, 255, 255, .9)"
        size={24}
        style={{backgroundColor: 'transparent'}}
      />
    </View>
  )
}
const _renderDoneButton = () => {
  return (
    <View style={styles.buttonCircle}>
      <Ionicons
        name="md-checkmark"
        color="rgba(255, 255, 255, .9)"
        size={24}
        style={{backgroundColor: 'transparent'}}
      />
    </View>
  )
}

const IntroGradient = props => {
  const renderItem = ({item, dimensions}) => (
    <LinearGradient
      style={[styles.mainContent, dimensions]}
      colors={item.colors}
      start={{x: 0, y: 0.1}}
      end={{x: 0.1, y: 1}}
    >
      <Ionicons
        style={{backgroundColor: 'transparent'}}
        name={item.icon}
        size={200}
        color="white"
      />
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    </LinearGradient>
  )

  return (
    <AppIntroSlider
      renderItem={renderItem}
      slides={slides}
      showSkipButton
      onSkip={props.onSkip}
      onDone={props.onDone}
      renderDoneButton={_renderDoneButton}
      renderNextButton={_renderNextButton}
    />
  )
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  image: {
    width: 320,
    height: 320
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16
  },
  title: {
    fontSize: 22,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default IntroGradient
