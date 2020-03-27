import React, {Component} from 'react'
import MapView, {Marker, Callout, Circle} from 'react-native-maps'
// import axios from 'axios'
import {connect} from 'react-redux'
import {fetchNearByCrumInstances} from '../store/crumInstances'
import {getCurrentPosition, stopTracking} from '../store/locations'
import Carousel from 'react-native-snap-carousel'
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  SafeAreaView
} from 'react-native'
import {Actions} from 'react-native-router-flux' // New code
import {SCALER} from './utils'
function getRandomInt(min, max) {
  return min + Math.random() * (max - min + 1)
}
class DisMapScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      markers: []
    }
    // this.onCarouselItemChange = this.onCarouselItemChange.bind(this)
    // this.renderCarouselItem = this.renderCarouselItem.bind(this)
  }

  // componentDidMount = () => {
  //   this.props.fetchInitialData()

  //   // this.props.fetchNearByCrumInstances()
  // }
  // componentWillUnmount = () => {
  //   this.props.unFetchInitialData()
  // }

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

  onMarkerPressed = (location, index) => {
    this._map.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121
    })
    this._carousel.snapToItem(index)
  }
  onCarouselItemChange = index => {
    let location = this.props.crumInstances[index]
    this._map.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121
    })
    this.state.markers[index].showCallout()
  }

  renderCarouselItem = ({item}) => (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Image style={styles.cardImage} source={require('./breakmarker.png')} />
    </View>
  )

  render() {
    const {locations, crumInstances} = this.props
    // console.log('CRUM INSTANCES MAP VIEW:', crumInstances)
    // console.log('THIS.PROPS.LOCATION:', locations)
    // console.log('THIS IS THE LAT', typeof locations.latitude)
    // console.log('THIS IS THE LONG', typeof locations.longitude)

    return (
      <SafeAreaView style={styles.container}>
        {/* <Text
          style={styles.welcome}
          onPress={() => Actions.gray()} // New Code
        >
          Scarlet Screen
        </Text> */}
        {locations.longitude && locations.latitude ? (
          <MapView
            ref={map => (this._map = map)}
            showsUserLocation={true}
            style={styles.map}
            initialRegion={{
              latitude: locations.latitude,
              longitude: locations.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121
            }}
          >
            <Circle
              center={locations}
              radius={1000}
              fillColor="rgba(200,300,200,0.5)"
            />
            {this.props.crumInstances.map((crum, index) => {
              return (
                <Marker
                  key={crum.id}
                  // eslint-disable-next-line no-return-assign
                  // eslint-disable-next-line react/no-direct-mutation-state
                  ref={ref => (this.state.markers[index] = ref)}
                  onPress={() => this.onMarkerPressed(crum, index)}
                  coordinate={{
                    latitude: +crum.latitude,
                    longitude: +crum.longitude
                  }}
                >
                  <Image
                    source={require('../../assets/crumicon.png')}
                    style={{height: 30, width: 30}}
                  />
                  <Callout style={{width: 110, height: 20}}>
                    <Text>{crum.message}</Text>
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
          removeClippedSubviews={false}
          onSnapToItem={index => this.onCarouselItemChange(index)}
        />
      </SafeAreaView>
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
    marginBottom: 10
  },
  cardContainer: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    height: 100,
    width: 300,
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardImage: {
    height: 120,
    width: 100,
    bottom: 0
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
    longitudeIdx: Math.floor(state.locations.longitude * SCALER),
    latitudeIdx: Math.floor(state.locations.latitude * SCALER)
  }
})

const mapDispatch = dispatch => {
  return {
    // fetchInitialData: () => {
    //   dispatch(getCurrentPosition())
    // },
    // unFetchInitialData: () => {
    //   dispatch(stopTracking())
    // },
    fetchCrum: (latitudeIdx, longitudeIdx) => {
      dispatch(fetchNearByCrumInstances(latitudeIdx, longitudeIdx))
    }
  }
}

const MapScreen = connect(mapState, mapDispatch)(DisMapScreen)

export default MapScreen
