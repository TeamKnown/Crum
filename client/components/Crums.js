import {Renderer, THREE} from 'expo-three'
import ExpoTHREE from 'expo-three'
import {Asset} from 'expo-asset'
import {AR} from 'expo'

export const createCube = (color, orientation) => {
  const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4)
  // Simple color material
  // const texture = new THREE.TextureLoader().load(
  //   '../../public/HandSanitizer.png'
  // )
  const material = new THREE.MeshPhongMaterial({
    // map: texture,
    color: color //0xff00ff
  })

  const cube = new THREE.Mesh(geometry, material)
  cube.position.z = orientation.z
  cube.position.x = orientation.x
  cube.position.y = orientation.y
  return cube
}

export const createPlane = async (color, orientation) => {
  const geometry = new THREE.PlaneGeometry(1, 1)
  // const loader = new THREE.TextureLoader()
  // const texture = await loader.load('https://i.imgur.com/RrXwcvm.jpeg')
  // const texture = await ExpoTHREE.loadAsync('../../public/bg.jpg')
  // const texture = await Asset.loadAsync('https://i.imgur.com/RrXwcvm.jpeg')
  const texture = await ExpoTHREE.loadTextureAsync({
    asset: require('../../public/bg.jpg')
  })
  console.log('texture')
  console.log(texture)
  const material = new THREE.MeshPhongMaterial({
    map: texture,
    color: color
  })
  const plane = new THREE.Mesh(geometry, material)
  plane.position.z = orientation.z
  plane.position.x = orientation.x
  plane.position.y = orientation.y
  return plane
}
