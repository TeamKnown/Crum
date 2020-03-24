import {Renderer, THREE} from 'expo-three'
import ExpoTHREE from 'expo-three'
// import * as Location from 'expo-location'

import {Asset} from 'expo-asset'
import {AR} from 'expo'

export const createCube = (color, orientation) => {
  const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4)
  const material = new THREE.MeshPhongMaterial({
    color: color
  })

  const cube = new THREE.Mesh(geometry, material)
  cube.position.z = orientation.z
  cube.position.x = orientation.x
  cube.position.y = orientation.y
  return cube
}

export const createPlane = async (color, imgUrl, orientation) => {
  const geometry = new THREE.PlaneGeometry(2, 2)
  const texture = await ExpoTHREE.loadTextureAsync({
    asset: imgUrl,
    color: 0xffffff00
  })
  const material = new THREE.MeshLambertMaterial({
    map: texture
  })
  const plane = new THREE.Mesh(geometry, material)
  plane.position.z = orientation.z
  plane.position.x = orientation.x
  plane.position.y = orientation.y
  plane.rotation.y = Math.atan2(-orientation.x, -orientation.z) // make sure the text is facing us
  return plane
}

export const createText = async (
  color,
  message,
  fontJson,
  size,
  orientation
) => {
  const font = await new THREE.FontLoader().parse(fontJson)
  const geometry = new THREE.TextBufferGeometry(message, {
    font: font,
    size: size,
    height: 0.1
  })
  geometry.computeBoundingBox()
  geometry.computeVertexNormals()
  const material = new THREE.MeshPhongMaterial({
    color: color
  })
  const text = new THREE.Mesh(geometry, material)
  text.position.z = orientation.z
  text.position.x = orientation.x
  text.position.y = orientation.y
  text.rotation.y = Math.atan2(-orientation.x, -orientation.z) // make sure the text is facing us
  text.rotation.z = 0

  return text
}

// no longer need this code for not but it generates a rainbow of cubes i 8 directions
// scene.add(createCube(0x0000ff, {x: 0, y: 0, z: 4.4})) // blue cube to the South
// scene.add(createCube(0x00ffff, {x: -3, y: 0, z: 3})) // teal cube to the South-West
// scene.add(createCube(0x00ff00, {x: -4.4, y: 0, z: 0})) // green cube to the West
// scene.add(createCube(0xffff00, {x: -3, y: 0, z: -3})) // yellow cube to the North-West
// scene.add(createCube(0xff9900, {x: 0, y: 0, z: -4.4})) // orange cube to the North
// scene.add(createCube(0xff0000, {x: 3, y: 0, z: -3})) // red cube to the North-East
// scene.add(createCube(0xff00ff, {x: 4.4, y: 0, z: 0})) // magenta cube to the East
// scene.add(createCube(0x9900ff, {x: 3, y: 0, z: 3})) // Electric Purple cube to the South East
// scene.add(
//   await createText(0x00ff00, 'W', fonts.font1, 0.3, {
//     x: -4.4,
//     y: 0,
//     z: 0
//   })
// )
// scene.add(
//   await createText(0xff9900, 'N', fonts.font1, 0.3, {
//     x: 0,
//     y: 0,
//     z: -4.4
//   })
// )

// scene.add(
//   await createText(0x0000ff, 'S', fonts.font1, 0.3, {
//     x: 0,
//     y: 0,
//     z: 4.4
//   })
// )

// scene.add(
//   await createText(0xff00ff, 'E', fonts.font1, 0.3, {
//     x: 4.4,
//     y: 0,
//     z: 0
//   })
// )
