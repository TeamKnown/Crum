import { AR } from "expo";
import { GraphicsView } from "expo-graphics";
import { Renderer, THREE } from "expo-three";
import { BackgroundTexture, Camera } from "expo-three-ar";
import * as React from "react";
import { Platform, View } from "react-native";

let renderer, scene, camera;

export default function App() {
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
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
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

  return (
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
    </View>
  );
}

// import { StyleSheet, Text, View } from "react-native";
// // import Expo, { GLView } from "expo-server-sdk"; // deprecated
// import { GLView } from "expo-gl";
// import React, { Component } from "react";
// import * as THREE from "three";
// import ExpoTHREE from "expo-three"; // !!
// import renderer from "react-test-renderer";
// import * as ThreeAR from "expo-three-ar";
// class App extends Component {
//   _onGLContextCreate = async gl => {
//     // Here is where we will define our scene, camera and renderer
//     // 1. Scene
//     var scene = new THREE.Scene();
//     // 2. Camera
//     // const camera = new THREE.PerspectiveCamera(
//     //   75,
//     //   gl.drawingBufferWidth / gl.drawingBufferHeight,
//     //   0.1,
//     //   1000
//     // );

//     // 3. Renderer
//     const renderer_ = new ExpoTHREE.Renderer({ gl });
//     // const renderer_ = new renderer.create({ gl });
//     renderer_.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

//     // Define our shape (Below is a tetrahedron, but can be whatever)
//     const geometry = new THREE.TetrahedronBufferGeometry(0.1, 0);
//     // Define the material, Below is material with hex color #00ff00
//     const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

//     // For custom material of any image, simply download any image into your project and use:
//     // Define the full 3-D object
//     const objectToRender = new THREE.Mesh(geometry, material);
//     // Specifying the cameras Z position will allow the object to appear in front of the camera rather that in line (which the camera which is the default)

//     scene.add(objectToRender);

//     const animate = () => {
//       requestAnimationFrame(render);
//       mesh.rotation.x += 0.01;
//       mesh.rotation.y += 0.01;
//       renderer_.render(scene, camera);
//       gl.endFrameEXP();
//     };
//     // render();
//     console.log(Object.keys(this));
//     console.log(this._onGLContextCreate);
//     console.log(this.state);
//     // const arSession = await this._glView.startARSessionAsync();
//     // const arSession = await this._glView.startAsync();

//     const camera = ExpoTHREE.createARCamera(
//       arSession,
//       width,
//       height,
//       0.01,
//       1000
//     );
//     camera.position.z = 2;
//     this.scene.background = ExpoTHREE.createARBackgroundTexture(
//       arSession,
//       renderer
//     );
//   };
//   render() {
//     return (
//       // <View style={styles.container}>
//       //   <Text>
//       //     Hello we are the known and we want to have you all drop crums!
//       //   </Text>
//       <GLView style={{ flex: 1 }} onContextCreate={this._onGLContextCreate} />
//       // </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center"
//   }
// });

// export default App;
