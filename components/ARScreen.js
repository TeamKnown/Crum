import {AR} from 'expo'
import {GraphicsView} from 'expo-graphics'
import {Renderer, THREE} from 'expo-three'
import {BackgroundTexture, Camera} from 'expo-three-ar'
import * as React from 'react'
import {Platform, View, Text, StyleSheet, Image} from 'react-native'
import {Router, Scene, Stack} from 'react-native-router-flux'
import NavigationBar from 'react-native-navbar'
import axios from 'axios'
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

export default class ARScreen extends React.Component {
  state = {
    currentLongitude: 'unknown', //Initial Longitude
    currentLatitude: 'unknown', //Initial Latitude
    currentMapHeading: 'unknown',
    currentTrueHeading: 'unknown',
    headingSubscription: undefined
  }
  componentDidMount = async () => {
    navigator.geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        const currentLongitude = JSON.stringify(position.coords.longitude)
        //getting the Longitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude)
        //getting the Latitude from the location json
        this.setState({currentLongitude: currentLongitude})
        //Setting state Longitude to re re-render the Longitude Text
        this.setState({currentLatitude: currentLatitude})
        //Setting state Latitude to re re-render the Longitude Text
      },
      error => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    )
    this.watchID = navigator.geolocation.watchPosition(position => {
      //Will give you the location on location change
      // console.log(position)
      const currentLongitude = JSON.stringify(position.coords.longitude)
      //getting the Longitude from the location json
      const currentLatitude = JSON.stringify(position.coords.latitude)
      //getting the Latitude from the location json
      this.setState({currentLongitude: currentLongitude})
      //Setting state Longitude to re re-render the Longitude Text
      this.setState({currentLatitude: currentLatitude})
      //Setting state Latitude to re re-render the Longitude Text
    })
  }
  componentWillUnmount = () => {
    navigator.geolocation.clearWatch(this.watchID)
  }
  render() {
    if (Platform.OS !== 'ios') return <div>AR only supports IOS device</div>

    const onContextCreate = async ({gl, pixelRatio, width, height}) => {
      AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal)

      renderer = new Renderer({gl, pixelRatio, width, height})
      // renderer.gammaInput = true;
      // renderer.gammaOutput = true;
      // renderer.shadowMap.enabled = true;

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
      // Place the box hi0.4 meters in front of us.
      const {data} = await axios.get(
        'http://192.168.1.167:19001/api/cruminstances'
      )
      console.log(data)
      // console.log(Object.keys(cube))
      // // console.log(cube)
      // console.log(heading)
      // console.log(cube.position)
      // console.log(cube.rotation)
      console.log(plane)
      scene.add(cube)
      scene.add(plane)
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

    // const TabIcon = ({selected, title}) => {
    //   return <Text style={{color: selected ? 'red' : 'black'}}>{title}</Text>
    // }

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
            Longitude: {this.state.currentLongitude}
          </Text>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16
            }}
          >
            Latitude: {this.state.currentLatitude}
          </Text>
          {/* <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16
            }}
          >
            MapHeading: {Math.floor(this.state.currentMapHeading)}
          </Text>
          <Text
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 16
            }}
          >
            TrueHeading: {Math.floor(this.state.currentTrueHeading)}
          </Text> */}
        </View>
      </View>
    )
  }
}
