import React, {Component} from 'react'
import MapView, {Marker} from 'react-native-maps'
// import axios from 'axios'
import {connect} from 'react-redux'
import {fetchNearByCrumInstances} from '../store/crumInstances'
import {getCurrentPosition, stopTracking} from '../store/locations'

import {StyleSheet, Text, View, Dimensions} from 'react-native'
import {Actions} from 'react-native-router-flux' // New code

class DisMapScreen extends Component {
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
    this.props.fetchInitialData()

    // this.props.fetchNearByCrumInstances()

    // navigator.geolocation.getCurrentPosition(
    //   position => {
    //     this.setState({
    //       latitude: position.coords.latitude,
    //       longitude: position.coords.longitude,
    //       error: null
    //     })
    //   },
    //   error => this.setState({error: error.message}),
    //   {enableHighAccuracy: true, timeout: 20000, maximumAge: 2000}
    // )
  }

  componentWillUnmount = () => {
    this.props.unFetchInitialData()
  }

  render() {
    const {locations} = this.props
    // console.log('THIS.PROPS.LOCATION:', locations)
    console.log('THIS IS THE LAT', typeof locations.altitude)
    console.log('THIS IS THE LONG', typeof locations.longitude)

    return (
      <View style={styles.container}>
        {/* <Text
          style={styles.welcome}
          onPress={() => Actions.gray()} // New Code
        >
          Scarlet Screen
        </Text> */}
        {locations.longitude !== 0 && locations.altitude !== 0 ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: locations.altitude,
              longitude: locations.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121
            }}
          >
            {/* <Marker coordinate={this.state} /> */}
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

const mapState = state => ({
  crumInstances: state.crumInstances,
  locations: state.locations
})

const mapDispatch = dispatch => {
  return {
    fetchInitialData: () => {
      dispatch(getCurrentPosition())
    },
    unFetchInitialData: () => {
      dispatch(stopTracking())
    },
    fetchNearByCrumInstances: (latitudeIdx, longitudeIdx) => {
      dispatch(fetchNearByCrumInstances(latitudeIdx, longitudeIdx))
    }
  }
}

const MapScreen = connect(mapState, mapDispatch)(DisMapScreen)

export default MapScreen
