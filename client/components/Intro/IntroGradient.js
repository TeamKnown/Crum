import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider'
import {LinearGradient} from 'expo-linear-gradient'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {toggleShowSlidesAgain} from '../../store/user'
import {connect} from 'react-redux'

const slides = [
  {
    key: 'firstSlide',
    title: 'DROP YOUR FIRST CRUM',
    text:
      'Head to the AR screen and tap anywhere to select your favorite Crum.\nWrite a message and drop!\nLook around... there it is!',
    icon: 'ios-pin',
    colors: ['#63E2FF', '#B066FE']
  },
  {
    key: 'secondSlide',
    title: 'FOLLOW THE MAP',
    text:
      'Use the map view to navigate your way to nearby Crums.\nTap on any crum to see exactly how far away it',
    icon: 'ios-navigate',
    colors: ['#A3A1FF', '#3A3897']
  },
  {
    key: 'thirdSlide',
    title: 'INTERACT',
    text: 'Collect, edit, and comment on Crums as you wander around town!',
    icon: 'ios-walk',
    colors: ['#29ABE2', '#4F00BC']
  },
  {
    key: 'fourthSlide',
    title: 'HAVE FUN !',
    text:
      'Enjoy the outdoors, have fun with it, and always be aware of your surroundings!\n- Crum 💜',
    icon: 'ios-happy',
    colors: ['teal', '#4F00BC']
  }
]

const _renderNextButton = () => {
  return (
    <View style={styles.buttonCircle}>
      <Ionicons
        name="md-arrow-round-forward"
        color="rgba(255, 255, 255, .9)"
        size={30}
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
        size={30}
        style={{backgroundColor: 'transparent'}}
      />
    </View>
  )
}

const _renderDontShowAgainButton = () => {
  return (
    <View style={styles.buttonCircle}>
      <Ionicons
        name="md-checkmark"
        color="rgba(255, 255, 255, .9)"
        size={30}
        style={{backgroundColor: 'transparent'}}
      />
    </View>
  )
}

const DisIntroGradient = props => {
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
    justifyContent: 'center'
  },
  image: {
    width: 320,
    height: 320
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: '35%',
    paddingHorizontal: 16,
    fontWeight: '500',
    fontFamily: 'Helvetica-Oblique',
    padding: '5%'
  },
  title: {
    fontFamily: 'AvenirNext-Heavy',
    fontSize: 22,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: '3%',
    marginTop: '5%',
    fontWeight: 'bold'
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

const mapState = state => {
  return {
    user: state.user
  }
}

const mapDispatch = dispatch => {
  return {
    toggleShowSlidesAgain: id => dispatch(toggleShowSlidesAgain(id))
  }
}

export default connect(mapState, mapDispatch)(DisIntroGradient)
