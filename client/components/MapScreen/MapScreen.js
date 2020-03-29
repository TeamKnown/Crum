import React, {Component} from 'react'
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Circle,
  Polyline
} from 'react-native-maps'
import {connect} from 'react-redux'
import {fetchNearByCrumInstances} from '../../store/crumInstances'
import {getCurrentPosition, stopTracking} from '../../store/locations'
import Carousel from 'react-native-snap-carousel'
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  SafeAreaView
} from 'react-native'
import {SCALER} from '../utils'
import {images} from '../../../assets'
import {CurrentLocationButton} from './CurrentLocationButton'
import {GOOGLE_API_KEY} from '../../../secretDom'
import polyline from '@mapbox/polyline'

const {width, height} = Dimensions.get('screen')

class DisMapScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      markers: [],
      latitude: null,
      longitude: null,
      locations: [],
      coords: []
    }
    // this.onCarouselItemChange = this.onCarouselItemChange.bind(this)
    // this.renderCarouselItem = this.renderCarouselItem.bind(this)
    this.onMarkerPressdRoutes = this.onMarkerPressdRoutes.bind(this)
    this.getDirections = this.getDirections.bind(this)
  }

  componentDidMount() {
    this.isMounted = true
  }
  componentWillUnmount() {
    this.isMounted = false
  }
  //map routes functions

  mergeCoords = () => {
    const {desLatitude, desLongitude} = this.state

    const hasStartAndEnd =
      this.props.locations.latitude !== null && desLatitude !== null

    if (hasStartAndEnd) {
      const concatStart = `${this.props.locations.latitude},${this.props.locations.longitude}`
      const concatEnd = `${desLatitude},${desLongitude}`
      this.getDirections(concatStart, concatEnd)
    }
  }

  async getDirections(startLoc, desLoc) {
    try {
      const resp = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${desLoc}&key=${GOOGLE_API_KEY}`
      )
      const respJson = await resp.json()
      const response = respJson.routes[0]
      const distanceTime = response.legs[0]
      const distance = distanceTime.distance.text
      const time = distanceTime.duration.text
      const points = polyline.decode(
        respJson.routes[0].overview_polyline.points
      )
      const coords = points.map(point => {
        return {
          latitude: point[0],
          longitude: point[1]
        }
      })

      this.setState({coords, distance, time})

      // console.log('this.state coords', this.state.coords)
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  onMarkerPressdRoutes = crumInstance => {
    let location = {
      coords: {
        latitude: crumInstance.latitude,
        longitude: crumInstance.longitude
      }
    }

    const {
      coords: {latitude, longitude}
    } = location
    this.setState(
      {
        destination: location,
        desLatitude: latitude,
        desLongitude: longitude
      },

      this.mergeCoords
    )
  }
  renderDistanceInfo() {
    return (
      <View
        style={{
          width: width - 80,
          paddingTop: 15,
          backgroundColor: 'rgba(0,0,0,0.1)',
          justifyContent: 'flex-end'
        }}
      >
        <Text style={{fontWeight: 'bold'}}>
          Estimated Time: {this.state.time}
        </Text>
        <Text style={{fontWeight: 'bold'}}>
          Estimated Distance: {this.state.distance}
        </Text>
      </View>
    )
  }
  //locate user button function
  centerMap(locations) {
    this._map.animateToRegion({
      latitude: locations.latitude,
      longitude: locations.longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121
    })
  }

  //carousel functions
  onMarkerPressedCarousel = (location, index) => {
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
      <Image style={styles.cardImage} source={images[item.crum.name]} />
    </View>
  )

  render() {
    const {locations, crumInstances} = this.props

    if (locations.longitude && locations.latitude) {
      return (
        <SafeAreaView style={styles.container}>
          <CurrentLocationButton
            cb={() => {
              this.centerMap(locations)
            }}
          />
          <MapView
            provider={PROVIDER_GOOGLE}
            ref={map => (this._map = map)}
            showsUserLocation={true}
            showsCompass={true}
            rotateEnabled={false}
            style={styles.map}
            initialRegion={{
              latitude: locations.latitude,
              longitude: locations.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121
            }}
          >
            {this.state.time &&
              this.state.distance &&
              this.renderDistanceInfo()}
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
                  onPress={() => {
                    this.onMarkerPressdRoutes(crum)
                    this.onMarkerPressedCarousel(crum, index)
                  }}
                  coordinate={{
                    latitude: +crum.latitude,
                    longitude: +crum.longitude
                  }}
                >
                  <Image
                    source={require('../../../assets/crumicon.png')}
                    style={{height: 30, width: 30}}
                  />
                  <Callout style={{width: 110, height: 20}}>
                    <Text>{crum.message}</Text>
                  </Callout>
                </Marker>
              )
            })}
            <Text>{crumInstances.length}</Text>
            <Polyline
              strokeWidth={6}
              strokeColor="#4A89F3"
              coordinates={this.state.coords}
            />
          </MapView>
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
    } else {
      return <Text>Loading your current location....</Text>
    }
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
    backgroundColor: 'rgba(0,0,0,0.1)',
    height: 140,
    width: 300,
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardImage: {
    height: 100,
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
    // fetchCrum: (latitudeIdx, longitudeIdx) => {
    //   dispatch(fetchNearByCrumInstances(latitudeIdx, longitudeIdx))
    // }
  }
}

const MapScreen = connect(mapState, mapDispatch)(DisMapScreen)

export default MapScreen
