import React, {Component} from 'react'
import MapView, {Marker} from 'react-native-maps'

import {StyleSheet, Text, View, Dimensions} from 'react-native'
import {Actions} from 'react-native-router-flux' // New code

class MapScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      longitude: 10,
      latitude: 0,
      error: null
    }
  }

  componentDidMount() {
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
            latitude: 37.78825,
            longitude: -122.4324,
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
