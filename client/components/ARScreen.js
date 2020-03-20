import {AR} from 'expo'
import {GraphicsView} from 'expo-graphics'
import {Renderer, THREE} from 'expo-three'
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
import {createCube, createPlane} from './Crums.js'
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
    longitudeIdx: undefined,
    latitudeIdx: undefined
  }
  componentDidMount = () => {
    this.props.fetchInitialData()
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
    console.log('rerendering')
    if (Platform.OS !== 'ios') return <div>AR only supports IOS device</div>

    const onContextCreate = async ({gl, pixelRatio, width, height}) => {
      AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal)
      renderer = new Renderer({gl, pixelRatio, width, height})
      scene = new THREE.Scene()
      scene.background = new BackgroundTexture(renderer)
      camera = new Camera(width, height, 0.01, 1000)
      const heading = await Location.getHeadingAsync()
      const plane = createPlane()
      const cube = createCube()
      scene.add(cube)
      scene.add(plane)
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
