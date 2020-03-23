import {AR} from 'expo'
import {GraphicsView} from 'expo-graphics'
import {Renderer, THREE} from 'expo-three'
import {Asset} from 'expo-asset'
import {BackgroundTexture, Camera} from 'expo-three-ar'
import {connect} from 'react-redux'
import * as React from 'react'
import {
  Platform,
  Button,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity
} from 'react-native'
import {getCurrentPosition, stopTracking, fetchCrums} from '../store/'
import {images, fonts} from '../../assets/'

import {
  postCrumInstance,
  fetchNearByCrumInstances
} from '../store/crumInstances'
import * as Location from 'expo-location'
import {createCube, createPlane, createText} from './Crums.js'
let renderer, scene, camera

class DisARScreen extends React.Component {
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }
  state = {
    longitudeIdx: undefined, // longitudeIdx is the integer version of longitude it is the floor of (10000 * longitude)
    latitudeIdx: undefined // likewise, it is floor of (10000 * latitude)
  }
  componentDidMount = () => {
    this.props.fetchInitialData() // this subscribed to update current locations every time interval
    this.props.fetchCrums()
  }
  componentWillUnmount = () => {
    this.props.unFetchInitialData() // this unsubscribed to update current locations
  }
  handleClick = () => {
    // alert('Button clicked!')
    this.props.dropCrumInstances({
      longitude: this.props.locations.longitude,
      latitude: this.props.locations.latitude
    })
  }
  // longitudeIdx is the integer version of longitude it is the floor of (10000 * longitude)
  // likewise latitude is the floor of (10000 * latitude)
  // we get longitudeIdx and latitude from REDUX store, and store it in our REACT state
  // when longitudeIdx or latitude in REDUX store changes, we update REACT state
  // we also requery the list of nearby crums
  // this is subject to future optimization and code refactoring
  // More at https://reactjs.org/docs/hooks-faq.html#how-to-memoize-calculations
  static getDerivedStateFromProps(props, state) {
    if (
      Number.isInteger(props.locations.longitudeIdx) && //initially longitudeIdx and latitudeIdx are NaN
      Number.isInteger(props.locations.latitudeIdx) &&
      (props.locations.latitudeIdx !== state.latitudeIdx ||
        props.locations.longitudeIdx !== state.longitudeIdx)
    ) {
      props.fetchCrumInstances(
        props.locations.latitudeIdx,
        props.locations.longitudeIdx
      ) // fetch the list of nearby crums
      return {
        ...state,
        latitudeIdx: props.locations.latitudeIdx,
        longitudeIdx: props.locations.longitudeIdx,
        numCrum: props.locations.length
      }
    } else {
      return state
    }
  }
  render() {
    const {locations, crumInstances, numCrum} = this.props
    // console.log('rerendering', locations)
    // console.log('CRUM INSTANCES AR VIEW:', numCrum)
    AR.setWorldAlignment('gravityAndHeading') // The coordinate system's y-axis is parallel to gravity, its x- and z-axes are oriented to compass heading, and its origin is the initial position of the device. z:1 means 1 meter South, x:1 means 1 meter east
    // AR.setWorldAlignment('alignmentCamera')
    // The scene coordinate system is locked to match the orientation of the camera.
    // AR.setWorldAlignment('gravity')
    // this is the default, The coordinate system's y-axis is parallel to gravity, and its origin is the initial position of the device.
    // console.log('world alignment is: ', AR.getWorldAlignment())
    if (Platform.OS !== 'ios') return <div>AR only supports IOS device</div>

    const onContextCreate = async ({gl, pixelRatio, width, height}) => {
      console.log('ON CONTEXT CREATE', crumInstances.length)
      AR.setWorldAlignment('gravityAndHeading')
      // AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal)
      renderer = new Renderer({gl, pixelRatio, width, height})
      scene = new THREE.Scene()
      scene.background = new BackgroundTexture(renderer)
      camera = new Camera(width, height, 0.01, 1000)

      crumInstances.forEach(async crumInstance => {
        const z = // positive z means to the south, this should be correct
          (-(crumInstance.latitude - locations.latitude) * 6356000 * 3.14 * 2) /
          360.0
        const x = // more negative longitude means positive x means to the east
          ((crumInstance.longitude - locations.longitude) *
            6356000 *
            3.14 *
            Math.cos((locations.longitude * 2 * 3.14) / 360) *
            2) /
          360.0
        scene.add(
          await createPlane(0xffffff, images[crumInstance.crum.name], {
            x: x,
            y: 0,
            z: z
          })
        )
      })

      // Showing pics for testing
      scene.add(
        await createPlane(
          0xffffff,
          require('../../assets/Crums/HandSanitizer.png'),
          {
            x: 0,
            y: 1,
            z: -6
          }
        )
      )
      scene.add(
        await createPlane(0xffffff, require('../../assets/Crums/Mask.png'), {
          x: -1,
          y: 1,
          z: 6
        })
      )

      // Showing where is South, North, East and West
      scene.add(
        await createText(0x00ff00, 'W', fonts.font1, 0.3, {
          x: -4.4,
          y: 0,
          z: 0
        })
      )
      scene.add(
        await createText(0xff9900, 'N', fonts.font1, 0.3, {
          x: 0,
          y: 0,
          z: -4.4
        })
      )

      scene.add(
        await createText(0x0000ff, 'S', fonts.font1, 0.3, {
          x: 0,
          y: 0,
          z: 4.4
        })
      )

      scene.add(
        await createText(0xff00ff, 'E', fonts.font1, 0.3, {
          x: 4.4,
          y: 0,
          z: 0
        })
      )

      scene.add(new THREE.AmbientLight(0xffffff))
    }

    const onResize = ({scale, width, height}) => {
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setPixelRatio(scale)
      renderer.setSize(width, height)
    }

    const onRender = delta => {
      renderer.render(scene, camera)
    }

    return (
      <ImageBackground
        source={require('../../public/background.png')}
        style={{
          flex: 1,
          width: null,
          height: null
        }}
      >
        <View style={styles.main}>
          <View style={{flex: 1}}>
            {Number.isInteger(this.props.numCrum) && (
              <View style={{flex: 1}}>
                <GraphicsView
                  style={{flex: 1}}
                  onContextCreate={onContextCreate}
                  onRender={onRender}
                  onResize={onResize}
                  isArEnabled
                  isArRunningStateEnabled
                  isArCameraStateEnabled
                />
              </View>
            )}
            {/* <Text style={styles.boldText}>You are Here</Text>
          <Image
            style={{width: 50, height: 50}}
            source={require('../../public/bg.jpg')}
          />*/}
            <View style={styles.container}>
              <View style={styles.bottomContainer}>
                <Text
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 16
                  }}
                >
                  longitude: {locations.longitudeIdx}
                </Text>
                <Text
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 16
                  }}
                >
                  latitude: {locations.latitudeIdx}
                </Text>
                <Text
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 16
                  }}
                >
                  nearby crums:{' '}
                  {JSON.stringify(
                    crumInstances.map(crumInstance => crumInstance.id)
                  )}
                </Text>
                <Text
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 16
                  }}
                >
                  default crums:{' '}
                  {JSON.stringify(this.props.crums.map(crum => crum.name))}
                </Text>
              </View>
              <TouchableOpacity style={styles.btnDrop}>
                <Button
                  style={{color: '#19ae9f'}}
                  title="Drop!"
                  onPress={this.handleClick}
                >
                  d r o p
                </Button>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    height: '100%',
    width: '100%',

    paddingBottom: 16
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  btnDrop: {
    height: 60,
    width: '90%',
    backgroundColor: 'white',
    borderColor: '#19ae9f',
    borderWidth: 2,
    textAlign: 'center',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16
  },
  boldText: {
    fontSize: 30,
    color: 'red'
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
})

const mapState = state => ({
  locations: {
    ...state.locations,
    longitudeIdx: Math.floor(state.locations.longitude * 10000),
    latitudeIdx: Math.floor(state.locations.latitude * 10000)
  },
  numCrum: state.crumInstances.length,
  crumInstances: state.crumInstances,
  crums: state.crums
})
const mapDispatch = dispatch => {
  return {
    fetchInitialData: () => {
      dispatch(getCurrentPosition())
    },
    unFetchInitialData: () => {
      dispatch(stopTracking())
    },
    fetchCrums: () => {
      dispatch(fetchCrums())
    },
    fetchCrumInstances: (latitudeIdx, longitudeIdx) => {
      dispatch(fetchNearByCrumInstances(latitudeIdx, longitudeIdx))
    },
    dropCrumInstances: newCrum => {
      dispatch(postCrumInstance(newCrum))
    }
  }
}

const ARScreen = connect(mapState, mapDispatch)(DisARScreen)

export default ARScreen
