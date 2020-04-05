import React, {Component} from 'react'
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Callout,
  Circle,
  Polyline
} from 'react-native-maps'
import {connect} from 'react-redux'
import {fetchNearByCrumInstances} from '../../store/crumInstancesNearby'
import {getCurrentPosition, stopTracking} from '../../store/locations'
import Carousel from 'react-native-snap-carousel'
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  SafeAreaView,
  Linking,
  Button
} from 'react-native'
import {SCALER} from '../utils'
import {images, purpleCrumIcon} from '../../../assets'
import {CurrentLocationButton} from './CurrentLocationButton'
import {GOOGLE_API_KEY} from '../../../secretDom'
import polyline from '@mapbox/polyline'
// import {Button} from 'react-native-paper'

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
      <View style={styles.route}>
        <Text style={styles.ETA}>
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
    const {locations, crumInstances, user} = this.props

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
            loadingEnabled={true}
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

            {this.props.crumInstances.map((crum, index) => {
              let color = crum.recipientId === user.id ? '#26DECB' : '#7C1E9F'
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
                    source={purpleCrumIcon}
                    style={{
                      height: 30,
                      width: 30,
                      tintColor: color
                    }}
                  />
                  <Callout style={styles.callout}>
                    <Text style={styles.text}>{crum.message}</Text>
                  </Callout>
                </Marker>
              )
            })}

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
            sliderWidth={width}
            itemWidth={300}
            removeClippedSubviews={false}
            onSnapToItem={index => this.onCarouselItemChange(index)}
          />
        </SafeAreaView>
      )
    } else {
      return (
        <View style={styles.permission}>
          <Text>
            {`We need your permission to use location features in this application.\n Please update your phone settings to get the most out of Crum`}
          </Text>
          <Button
            title="Go To Setting"
            onPress={() => {
              Linking.openURL('app-settings:')
            }}
          />
        </View>
      )
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
  callout: {width: 200},
  markerimg: {
    height: 30,
    width: 30,
    tintColor: 'yellow'
  },
  route: {
    flexDirection: 'column',
    width: '100%',
    paddingTop: 15,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ETA: {
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'APompadourBold'
  },
  permission: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop: 20
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
  },
  text: {
    fontFamily: 'APompadour'
  }
})

const mapState = state => ({
  user: state.user,
  crumInstances: state.crumInstancesNearby.filter(
    crumInstance =>
      crumInstance.recipientId === state.user.id ||
      crumInstance.userId === state.user.id ||
      crumInstance.recipientId === null
  ),
  locations: state.locations
})

const mapDispatch = dispatch => {
  return {}
}

const MapScreen = connect(mapState, mapDispatch)(DisMapScreen)

export default MapScreen
