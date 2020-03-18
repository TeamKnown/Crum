import { StyleSheet, Text, View } from "react-native";
import Expo, { GLView } from "expo"; // deprecated
import React, { Component } from "react";
import * as THREE from "three";
import ExpoTHREE from "expo-three";

export default class App extends Component {
  _onGLContextCreate = async gl => {
    // Here is where we will define our scene, camera and renderer
    // 1. Scene
    var scene = new THREE.Scene();
    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    // 3. Renderer
    const renderer = ExpoTHREE.createRenderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    // Define our shape (Below is a tetrahedron, but can be whatever)
    const geometry = new THREE.TetrahedronBufferGeometry(0.1, 0);
    // Define the material, Below is material with hex color #00ff00
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    or;
    // For custom material of any image, simply download any image into your project and use:
    // Define the full 3-D object
    const objectToRender = new THREE.Mesh(geometry, material);
    // Specifying the cameras Z position will allow the object to appear in front of the camera rather that in line (which the camera which is the default)
    camera.position.z = 2;

    scene.add(objectToRender);

    const animate = () => {
      requestAnimationFrame(render);
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
    const arSession = await this._glView.startARSessionAsync();
  };
  render() {
    return (
      <View style={styles.container}>
        <Text>
          Hello we are the known and we want to have you all drop crums!
        </Text>
        <GLView style={{ flex: 1 }} onContextCreate={this._onGLContextCreate} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
