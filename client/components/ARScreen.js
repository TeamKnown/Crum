import {AR} from 'expo'
import {GraphicsView} from 'expo-graphics'
import {Renderer, THREE} from 'expo-three'
import {Asset} from 'expo-asset'
import {BackgroundTexture, Camera} from 'expo-three-ar'
import {connect} from 'react-redux'
import * as React from 'react'
import {Platform, View, Text, StyleSheet, Image, Button} from 'react-native'
import {getCurrentPosition, stopTracking} from '../store/locations'
import {
  postCrumInstance,
  fetchNearByCrumInstances
} from '../store/crumInstances'
import * as Location from 'expo-location'
import {createCube, createPlane, createText} from './Crums.js'
let renderer, scene, camera

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    padding: 16
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

class DisARScreen extends React.Component {
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

    AR.setWorldAlignment('gravityAndHeading') // The coordinate system's y-axis is parallel to gravity, its x- and z-axes are oriented to compass heading, and its origin is the initial position of the device. x:1 means 1 meter South, z:1 means 1 meter east
    // AR.setWorldAlignment('alignmentCamera')
    // The scene coordinate system is locked to match the orientation of the camera.
    // AR.setWorldAlignment('gravity')
    // this is the default, The coordinate system's y-axis is parallel to gravity, and its origin is the initial position of the device.
    // console.log('world alignment is: ', AR.getWorldAlignment())

    if (Platform.OS !== 'ios') return <div>AR only supports IOS device</div>

    const onContextCreate = async ({gl, pixelRatio, width, height}) => {
      // console.log('onContextCreate')
      AR.setWorldAlignment('gravityAndHeading')
      // console.log('world alignment is: ', AR.getWorldAlignment())
      AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal)
      renderer = new Renderer({gl, pixelRatio, width, height})
      scene = new THREE.Scene()
      scene.background = new BackgroundTexture(renderer)
      camera = new Camera(width, height, 0.01, 1000)
      // generate a rainbow of boxes for demonstration purpose
      scene.add(await createPlane(0xffffff, {x: 0, y: 1, z: -4.4}))
      scene.add(await createText(0xff9900, {x: -1.3, y: 1, z: -4.4}))

      const texture = await Asset.loadAsync(
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/brick_bump.jpg'
      )
      // scene.add(createPlane(0xffffff, {x: 0, y: 1, z: -4.4})) // white plain to the North
      scene.add(createCube(0x0000ff, {x: 0, y: 0, z: 4.4})) // blue cube to the South
      scene.add(createCube(0x00ffff, {x: -3, y: 0, z: 3})) // teal cube to the South-West
      scene.add(createCube(0x00ff00, {x: -4.4, y: 0, z: 0})) // green cube to the West
      scene.add(createCube(0xffff00, {x: -3, y: 0, z: -3})) // yellow cube to the North-West
      scene.add(createCube(0xff9900, {x: 0, y: 0, z: -4.4})) // orange cube to the North
      scene.add(createCube(0xff0000, {x: 3, y: 0, z: -3})) // red cube to the North-East
      scene.add(createCube(0xff00ff, {x: 4.4, y: 0, z: 0})) // magenta cube to the East
      scene.add(createCube(0x9900ff, {x: 3, y: 0, z: 3})) // Electric Purple cube to the South East
      scene.add(new THREE.AmbientLight(0xffffff))
    }

    const onResize = ({scale, width, height}) => {
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setPixelRatio(scale)
      renderer.setSize(width, height)
    }

    const onRender = delta => {
      // if (mesh) {
      //   mesh.update(delta)
      // }
      renderer.render(scene, camera)
    }

    return (
      <View style={styles.container}>
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
            <View
              style={{
                position: 'absolute',
                top: '50%',
                alignSelf: 'flex-end'
              }}
            >
              <Button
                title="Drop"
                onPress={() => {
                  this.props.dropCrum({
                    longitude: this.props.locations.longitude,
                    latitude: this.props.locations.latitude
                  })
                }}
              />
            </View>
          </View>
          {/* <Text style={styles.boldText}>You are Here</Text> */}
          {/* <Image
            style={{width: 50, height: 50}}
            source={require('../../public/bg.jpg')}
          /> */}
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16
            }}
          >
            Long: {this.props.locations.longitudeIdx}
            Lat: {this.props.locations.latitudeIdx}
          </Text>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16
            }}
          >
            All nearby Crums:{' '}
            {JSON.stringify(
              this.props.crumInstances.map(crumInstance => crumInstance.id)
            )}
          </Text>
        </View>
      </View>
    )
  }
}

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
      dispatch(postCrumInstance(newCrum))
    }
  }
}

const ARScreen = connect(mapState, mapDispatch)(DisARScreen)

export default ARScreen
