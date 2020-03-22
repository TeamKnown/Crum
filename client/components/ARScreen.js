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
import {getCurrentPosition, stopTracking} from '../store/locations'
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
  }
  componentWillUnmount = () => {
    this.props.unFetchInitialData() // this unsubscribed to update current locations
  }
  handleClick = () => {
    // alert('Button clicked!')
    this.props.dropCrum({
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
      // console.log('location changed!!!', props.locations)
      props.fetchCrum(props.locations.latitudeIdx, props.locations.longitudeIdx) // fetch the list of nearby crums
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
    // console.log('rerendering')
    const {locations, crumInstances} = this.props
    console.log('CRUM INSTANCES AR VIEW:', crumInstances.length)
    AR.setWorldAlignment('gravityAndHeading') // The coordinate system's y-axis is parallel to gravity, its x- and z-axes are oriented to compass heading, and its origin is the initial position of the device. x:1 means 1 meter South, z:1 means 1 meter east
    // AR.setWorldAlignment('alignmentCamera')
    // The scene coordinate system is locked to match the orientation of the camera.
    // AR.setWorldAlignment('gravity')
    // this is the default, The coordinate system's y-axis is parallel to gravity, and its origin is the initial position of the device.
    // console.log('world alignment is: ', AR.getWorldAlignment())

    if (Platform.OS !== 'ios') return <div>AR only supports IOS device</div>

    const onContextCreate = async ({gl, pixelRatio, width, height}) => {
      console.log('ON CONTEXT CREATE', crumInstances.length)

      AR.setWorldAlignment('gravityAndHeading')
      // console.log('world alignment is: ', AR.getWorldAlignment())
      AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal)
      renderer = new Renderer({gl, pixelRatio, width, height})
      scene = new THREE.Scene()
      scene.background = new BackgroundTexture(renderer)
      camera = new Camera(width, height, 0.01, 1000)
      // generate a rainbow of boxes for demonstration purpose

      crumInstances.forEach(async crumInstance => {
        // console.log(crumInstance)
        const x =
          (-(crumInstance.latitude - this.props.locations.latitude) *
            6356000 *
            3.14 *
            2) /
          360.0
        const z =
          (-(crumInstance.longitude - this.props.locations.longitude) *
            6356000 *
            3.14 *
            Math.cos((this.props.locations.longitude * 2 * 3.14) / 360) *
            2) /
          360.0
        // console.log(x, z)
        scene.add(
          await createText(0xff9900, `CRUM # ${crumInstance.id}`, 1, {
            x: x,
            y: 1,
            z: z
          })
        )
      })

      // Showing hand sanitizer for testing purpose
      scene.add(await createPlane(0xffffff, {x: 0, y: 1, z: -6}))
      scene.add(
        await createText(0xff9900, 'hand sanitizer', 0.3, {
          x: -1.3,
          y: 1,
          z: -4.4
        })
      )
      scene.add(
        await createText(0x00ff00, 'W', 0.3, {
          x: -4.4,
          y: 1,
          z: 0
        })
      )
      scene.add(
        await createText(0xff9900, 'N', 0.3, {
          x: 0,
          y: 0,
          z: -4.4
        })
      )

      scene.add(
        await createText(0x0000ff, 'S', 0.3, {
          x: 0,
          y: 0,
          z: 4.4
        })
      )

      scene.add(
        await createText(0xff00ff, 'E', 0.3, {
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
      // console.log('ON RENDER', crumInstances.length)
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
                  longitude: {this.props.locations.longitudeIdx}
                </Text>
                <Text
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 16
                  }}
                >
                  latitude: {this.props.locations.latitudeIdx}
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
    paddingBottom: 10
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
  crumInstances: state.crumInstances
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
    },
    dropCrum: newCrum => {
      console.log('drop crum map dispatch')
      dispatch(postCrumInstance(newCrum))
    }
  }
}

const ARScreen = connect(mapState, mapDispatch)(DisARScreen)

export default ARScreen
