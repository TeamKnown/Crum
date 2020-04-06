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
    title: 'DROP A CRUM',
    text: `Head to the View tab and tap\n anywhere to drop your first Crum.\n\n  Don’t forget to select an icon and \nadd a message before you drop. \nLook around... there it is!\n\n Old phone? No problem. We support devices that aren’t AR-equipped. Go to Settings to accomodate your device.`,
    icon: 'ios-pin',
    colors: ['#19ae9f', '#4272a0']
  },
  {
    key: 'secondSlide',
    title: 'FOLLOW THE MAP',
    text:
      'Use the Map tab \nto find nearby Crums.\n\n Tap on a Crum if you need help finding it - we’ll tell you how far away it is and how to get there.',
    icon: 'ios-navigate',
    colors: ['#2a969f', '#535a9f']
  },
  {
    key: 'thirdSlide',
    title: 'INTERACT',
    text:
      'Drop, collect, and comment on Crums as you wander around town.\n\n Every Crum has a limit on how many times it can be collected, so get to it before someone else does!',
    icon: 'ios-walk',
    colors: ['#4272a0', '#6c379f']
  },
  {
    key: 'fourthSlide',
    title: 'ENJOY',
    text:
      'Have fun exploring! \n\nNo matter where you are, there could be Crums all around you!',
    icon: 'ios-happy',
    colors: ['#535a9f', '#7C1E9F']
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
    marginBottom: '15%',
    paddingHorizontal: 16,
    fontWeight: '500',
    fontFamily: 'Helvetica-Oblique',
    padding: '5%'
  },
  title: {
    fontFamily: 'AvenirNext-Heavy',
    fontSize: 26,
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
