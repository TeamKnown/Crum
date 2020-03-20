import {AR} from 'expo'
import {GraphicsView} from 'expo-graphics'
import {Renderer, THREE} from 'expo-three'
import {BackgroundTexture, Camera} from 'expo-three-ar'
import {connect} from 'react-redux'
import * as React from 'react'
import {Platform, View, Text, StyleSheet, Image} from 'react-native'

import {getCurrentPosition, stopTracking} from '../store'
import * as Location from 'expo-location'
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
  state = {}
  componentDidMount = async () => {
    this.props.fetchInitialData()
  }
  componentWillUnmount = () => {
    this.props.unFetchInitialData()
  }
  render() {
    if (Platform.OS !== 'ios') return <div>AR only supports IOS device</div>

    const onContextCreate = async ({gl, pixelRatio, width, height}) => {
      AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal)

      renderer = new Renderer({gl, pixelRatio, width, height})

      scene = new THREE.Scene()
      scene.background = new BackgroundTexture(renderer)

      camera = new Camera(width, height, 0.01, 1000)

      // Make a cube - notice that each unit is 1 meter in real life, we will make our box 0.1 meters
      const geometry = new THREE.BoxGeometry(0.4, 0.02, 0.02)
      // Simple color material
      const material = new THREE.MeshPhongMaterial({
        color: 0xff00ff
      })

      const heading = await Location.getHeadingAsync()
      // Combine our geometry and material
      const cube = new THREE.Mesh(geometry, material)
      const geometry2 = new THREE.PlaneGeometry(2, 2 * 0.75)
      const loader = new THREE.TextureLoader()
      const material2 = await new THREE.MeshPhongMaterial({
        map: loader.load('public/HandSanitizer.png')
      })
      const plane = new THREE.Mesh(geometry2, material2)
      // console.log(Object.keys(cube))
      // // console.log(cube)
      // console.log(heading)
      // console.log(cube.position)
      // console.log(cube.rotation)
      // console.log(plane)
      // scene.add(cube)
      // scene.add(plane)
      // Setup a light so we can see the cube color
      // AmbientLight colors all things in the scene equally.
      const light = new THREE.PointLight(0xffffff, 1, 0)

      // Specify the light's position
      light.position.set(1, 1, 100)

      // Add the light to the scene
      scene.add(light)
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
          <GraphicsView
            style={{flex: 1}}
            onContextCreate={onContextCreate}
            onRender={onRender}
            onResize={onResize}
            isArEnabled
            isArRunningStateEnabled
            isArCameraStateEnabled
          />
          <Text style={styles.boldText}>You are Here</Text>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16
            }}
          >
            Here: {JSON.stringify(this.props.locations)}
          </Text>
        </View>
      </View>
    )
  }
}

const mapState = state => ({locations: state.locations})
const mapDispatch = dispatch => {
  return {
    fetchInitialData: () => {
      dispatch(getCurrentPosition())
    },
    unFetchInitialData: () => {
      dispatch(stopTracking())
    }
  }
}

const ARScreen = connect(mapState, mapDispatch)(DisARScreen)

export default ARScreen
