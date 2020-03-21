import React, {Component} from 'react'
import MapView, {Marker, Callout, Circle} from 'react-native-maps'
// import axios from 'axios'
import {connect} from 'react-redux'
import {fetchNearByCrumInstances} from '../store/crumInstances'
import {getCurrentPosition, stopTracking} from '../store/locations'
import Carousel from 'react-native-snap-carousel'
import {StyleSheet, Text, View, Dimensions, Image} from 'react-native'
import {Actions} from 'react-native-router-flux' // New code

function getRandomInt(min, max) {
  return min + Math.random() * (max - min + 1)
}
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

  componentDidMount = () => {
    this.props.fetchInitialData()

    // this.props.fetchNearByCrumInstances()
  }
  componentWillUnmount = () => {
    this.props.unFetchInitialData()
  }

  // static getDerivedStateFromProps(props, state) {
  //   if (
  //     Number.isInteger(props.locations.longitudeIdx) &&
  //     Number.isInteger(props.locations.latitudeIdx) &&
  //     (props.locations.latitudeIdx !== state.latitudeIdx ||
  //       props.locations.longitudeIdx !== state.longitudeIdx)
  //   ) {
  //     console.log('location changed!!!', props.locations)
  //     props.fetchCrum(props.locations.latitudeIdx, props.locations.longitudeIdx)
  //     return {
  //       ...state,
  //       latitudeIdx: props.locations.latitudeIdx,
  //       longitudeIdx: props.locations.longitudeIdx
  //     }
  //   } else {
  //     return state
  //   }
  // }
  onCarouselItemChange = index => {
    let location = this.props.crumInstances[index]
    this._map.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121
    })
  }

  renderCarouselItem = ({item}) => (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Image style={styles.cardImage} source={require('./breakmarker.png')} />
    </View>
  )

  render() {
    const {locations, crumInstances} = this.props
    console.log('CRUM INSTANCES:', crumInstances.length)
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
        {locations.longitude && locations.latitude ? (
          <MapView
            ref={map => (this._map = map)}
            style={styles.map}
            initialRegion={{
              latitude: locations.latitude,
              longitude: locations.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121
            }}
          >
            <Marker coordinate={locations} />
            <Circle
              center={locations}
              radius={100}
              fillColor="rgba(200,300,200,0.5)"
            />
            {this.props.crumInstances.map(crum => {
              let coordinate = {
                latitude: +crum.latitude,
                longitude: +crum.longitude
              }
              return (
                <Marker key={crum.id} coordinate={coordinate}>
                  <Image
                    source={require('./breakmarker.png')}
                    style={{height: 30, width: 30}}
                  />
                  <Callout>
                    <Text>{crum.description}</Text>
                  </Callout>
                </Marker>
              )
            })}
            <Text>{crumInstances.length}</Text>
          </MapView>
        ) : (
          <Text>Loading your current location....</Text>
        )}
        <Carousel
          ref={c => {
            this._carousel = c
          }}
          data={this.props.crumInstances}
          containerCustomStyle={styles.carousel}
          renderItem={this.renderCarouselItem}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={300}
          onSnapToItem={index => this.onCarouselItemChange(index)}
        />
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
  },
  carousel: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 48
  },
  cardContainer: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    height: 200,
    width: 300,
    padding: 24,
    borderRadius: 24
  },
  cardImage: {
    height: 120,
    width: 300,
    bottom: 0,
    position: 'absolute',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24
  },
  cardTitle: {
    color: 'white',
    fontSize: 22,
    alignSelf: 'center'
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
