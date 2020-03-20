import React, {Component} from 'react'
import MapView, {Marker} from 'react-native-maps'
import axios from 'axios'

import {StyleSheet, Text, View, Dimensions} from 'react-native'
import {Actions} from 'react-native-router-flux' // New code

class MapScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      longitude: 0,
      latitude: 0,
      error: null
    }
  }

  async componentDidMount() {
    const {data} = await axios.get(
      '/api/cruminstances/nearme/?radium=5&latitudeIdx=40.70508&longitudeIdx=-74.00897'
    )

    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        })
      },
      error => this.setState({error: error.message}),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 2000}
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <Text
          style={styles.welcome}
          onPress={() => Actions.gray()} // New Code
        >
          Scarlet Screen
        </Text> */}
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 40.70508,
            longitude: -74.00897,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121
          }}
        >
          <Marker coordinate={this.state} />
        </MapView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
})

export default MapScreen
