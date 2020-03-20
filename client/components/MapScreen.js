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
  }
  componentWillUnmount = () => {
    this.props.unFetchInitialData()
  }

  static getDerivedStateFromProps(props, state) {
    if (
      Number.isInteger(props.locations.longitudeIdx) &&
      Number.isInteger(props.locations.latitudeIdx) &&
      (props.locations.latitudeIdx !== state.latitudeIdx ||
        props.locations.longitudeIdx !== state.longitudeIdx)
    ) {
      console.log('location changed!!!', props.locations)
      props.fetchCrum(props.locations.latitudeIdx, props.locations.longitudeIdx)
      return {
        ...state,
        latitudeIdx: props.locations.latitudeIdx,
        longitudeIdx: props.locations.longitudeIdx
      }
    } else {
      return state
    }
  }

  render() {
    const {locations, crumInstances} = this.props
    console.log('CRUM INSTANCES:', crumInstances)
    // console.log('THIS.PROPS.LOCATION:', locations)
    // console.log('THIS IS THE LAT', typeof locations.latitude)
    // console.log('THIS IS THE LONG', typeof locations.longitude)

    return (
      <View style={styles.container}>
        {/* <Text
          style={styles.welcome}
          onPress={() => Actions.gray()} // New Code
        >
          Scarlet Screen
        </Text> */}
        {locations.longitude !== 0 && locations.latitude !== 0 ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: locations.latitude,
              longitude: locations.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121
            }}
          >
            <Marker coordinate={locations} />

            {crumInstances
              ? crumInstances.map(crum => {
                  return (
                    <Marker
                      key={crum.id}
                      coordinate={{
                        latitude: +crum.latitude,
                        longitude: +crum.longitude
                      }}
                    />
                  )
                })
              : null}
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
  locations: {
    ...state.locations,
    longitudeIdx: Math.floor(state.locations.longitude * 10000),
    latitudeIdx: Math.floor(state.locations.latitude * 10000)
  }
})

const mapDispatch = dispatch => {
  return {
    fetchInitialData: () => {
      dispatch(getCurrentPosition())
    },
    unFetchInitialData: () => {
      dispatch(stopTracking())
    },
    fetchCrum: (latitudeIdx, longitudeIdx) => {
      dispatch(fetchNearByCrumInstances(latitudeIdx, longitudeIdx))
    }
  }
}

const MapScreen = connect(mapState, mapDispatch)(DisMapScreen)

export default MapScreen
