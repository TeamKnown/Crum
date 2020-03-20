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
      error: null,
      crumInstances: []
    }
  }

  componentDidMount = async () => {
    // console.log('BEFORE AXIOS GET CALL')
    const {data} = await axios.get(
      'http://192.168.0.223:19001/api/cruminstances/nearme?radium=1000&latitudeIdx=407074&longitudeIdx=-740000'
    )
    console.log('THIS IS THE DATA', data)

    this.setState({
      crumInstances: [...data]
    })
    console.log('STATE CRUM', this.state.crumInstances)

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
        {this.state.longitude !== 0 && this.state.latitude !== 0 ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121
            }}
          >
            <Marker coordinate={this.state} />
          </MapView>
        ) : (
          <Text>Loading your current location....</Text>
        )}
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
