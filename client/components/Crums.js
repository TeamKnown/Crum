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
  const geometry = new THREE.PlaneGeometry(2, 2)
  const texture2 = await ExpoTHREE.loadAsync(
    'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'
  )
  const texture = await ExpoTHREE.loadTextureAsync({
    asset: require('../../public/HandSanitizer.png')
  })
  const material = new THREE.MeshLambertMaterial({
    map: texture
  })
  const plane = new THREE.Mesh(geometry, material)
  plane.position.z = orientation.z
  plane.position.x = orientation.x
  plane.position.y = orientation.y
  return plane
}

export const createText = async (color, orientation) => {
  const json = require('./three_fonts/neue_haas_unica_pro_medium.json')
  const font = await new THREE.FontLoader().parse(json)
  const geometry = new THREE.TextBufferGeometry('hand sanitizer', {
    font: font,
    size: 0.3,
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
  return text
}
