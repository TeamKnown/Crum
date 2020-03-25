import {Renderer, THREE} from 'expo-three'
import ExpoTHREE from 'expo-three'

// export const createCube = (color, orientation) => {
//   const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4)
//   const material = new THREE.MeshBasicMaterial({
//     color: color
//   })

//   const cube = new THREE.Mesh(geometry, material)
//   cube.position.z = orientation.z
//   cube.position.x = orientation.x
//   cube.position.y = orientation.y
//   return cube
// }

export const createPlane = async (color, imgUrl, orientation) => {
  const geometry = new THREE.PlaneGeometry(2, 2)
  const texture = await ExpoTHREE.loadTextureAsync({
    asset: imgUrl,
    color: 0xffffff00
  })
  const material = new THREE.MeshStandardMaterial({
    map: texture
  })
  const plane = new THREE.Mesh(geometry, material)
  plane.position.z = orientation.z
  plane.position.x = orientation.x
  plane.position.y = orientation.y
  plane.rotation.y = Math.atan2(-orientation.x, -orientation.z) // make sure the text is facing us
  return plane
}

// export const createText = async (
//   color,
//   message,
//   fontJson,
//   size,
//   orientation
// ) => {
//   const font = await new THREE.FontLoader().parse(fontJson)
//   const geometry = new THREE.TextBufferGeometry(message, {
//     font: font,
//     size: size,
//     height: 0.1
//   })
//   geometry.computeBoundingBox()
//   geometry.computeVertexNormals()
//   const material = new THREE.MeshBasicMaterial({
//     color: color
//   })
//   const text = new THREE.Mesh(geometry, material)
//   text.position.z = orientation.z
//   text.position.x = orientation.x
//   text.position.y = orientation.y
//   text.rotation.y = Math.atan2(-orientation.x, -orientation.z) // make sure the text is facing us
//   text.rotation.z = 0

//   return text
// }
