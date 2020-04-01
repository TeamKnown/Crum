import React from 'react'
// import {View, Text, Stylesheet} from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider'

const slides = [
  {
    key: 'somethun',
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    image: require('../../../assets/Crums/1.jpg'),
    backgroundColor: '#59b2ab'
  },
  {
    key: 'somethun-dos',
    title: 'Title 2',
    text: 'Other cool stuff',
    image: require('../../../assets/Crums/2.jpeg'),
    backgroundColor: '#febe29'
  },
  {
    key: 'somethun1',
    title: 'Rocket guy',
    text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
    image: require('../../../assets/Crums/3.jpeg'),
    backgroundColor: '#22bcb5'
  }
]

const IntroImages = props => {
  return <AppIntroSlider slides={slides} onDone={props.onDone} />
}

export default IntroImages
