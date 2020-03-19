import { AR } from "expo";
import { GraphicsView } from "expo-graphics";
import { Renderer, THREE } from "expo-three";
import { BackgroundTexture, Camera } from "expo-three-ar";
import * as React from "react";
import { Platform, View, Text, StyleSheet, Image } from "react-native";
import { Router, Scene, Stack } from "react-native-router-flux";
import NavigationBar from "react-native-navbar";

let renderer, scene, camera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    padding: 16
  },
  boldText: {
    fontSize: 30,
    color: "red"
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-around"
  }
});

export default class ARScreen extends React.Component {
  state = {
    currentLongitude: "unknown", //Initial Longitude
    currentLatitude: "unknown" //Initial Latitude
  };
  componentDidMount = () => {
    navigator.geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        const currentLongitude = JSON.stringify(position.coords.longitude);
        //getting the Longitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);
        //getting the Latitude from the location json
        this.setState({ currentLongitude: currentLongitude });
        //Setting state Longitude to re re-render the Longitude Text
        this.setState({ currentLatitude: currentLatitude });
        //Setting state Latitude to re re-render the Longitude Text
      },
      error => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    this.watchID = navigator.geolocation.watchPosition(position => {
      //Will give you the location on location change
      console.log(position);
      const currentLongitude = JSON.stringify(position.coords.longitude);
      //getting the Longitude from the location json
      const currentLatitude = JSON.stringify(position.coords.latitude);
      //getting the Latitude from the location json
      this.setState({ currentLongitude: currentLongitude });
      //Setting state Longitude to re re-render the Longitude Text
      this.setState({ currentLatitude: currentLatitude });
      //Setting state Latitude to re re-render the Longitude Text
    });
  };
  componentWillUnmount = () => {
    navigator.geolocation.clearWatch(this.watchID);
  };
  render() {
    // if (Platform.OS !== "ios") return null;

    const onContextCreate = async ({ gl, pixelRatio, width, height }) => {
      AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);

      // await addDetectionImageAsync(image);

      renderer = new Renderer({ gl, pixelRatio, width, height });
      // renderer.gammaInput = true;
      // renderer.gammaOutput = true;
      // renderer.shadowMap.enabled = true;

      scene = new THREE.Scene();
      scene.background = new BackgroundTexture(renderer);

      camera = new Camera(width, height, 0.01, 1000);

      // Make a cube - notice that each unit is 1 meter in real life, we will make our box 0.1 meters
      const geometry = new THREE.BoxGeometry(0.2, 0.1, 0.1);
      // Simple color material
      const material = new THREE.MeshPhongMaterial({
        color: 0xff00ff
      });

      // Combine our geometry and material
      const cube = new THREE.Mesh(geometry, material);
      // Place the box 0.4 meters in front of us.
      cube.position.z = -0.4;
      // Add the cube to the scene
      scene.add(cube);
      // Setup a light so we can see the cube color
      // AmbientLight colors all things in the scene equally.
      scene.add(new THREE.AmbientLight(0xffffff));
    };

    const onResize = ({ scale, width, height }) => {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(scale);
      renderer.setSize(width, height);
    };

    const onRender = delta => {
      // if (mesh) {
      //   mesh.update(delta);
      // }

      renderer.render(scene, camera);
    };

    const TabIcon = ({ selected, title }) => {
      return <Text style={{ color: selected ? "red" : "black" }}>{title}</Text>;
    };

    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <GraphicsView
            style={{ flex: 1 }}
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
              justifyContent: "center",
              alignItems: "center",
              marginTop: 16
            }}
          >
            Longitude: {this.state.currentLongitude}
          </Text>
          <Text
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 16
            }}
          >
            Latitude: {this.state.currentLatitude}
          </Text>
        </View>
      </View>
    );
  }
}
