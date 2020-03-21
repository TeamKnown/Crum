import {Renderer, THREE} from 'expo-three'

export const createCube = (color, orientation) => {
  const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4)
  // Simple color material
  const material = new THREE.MeshPhongMaterial({
    color: color //0xff00ff
  })
  const cube = new THREE.Mesh(geometry, material)
  cube.position.z = orientation.z
  cube.position.x = orientation.x
  cube.position.y = orientation.y
  return cube
}

export const createPlane = (color, orientation) => {
  const geometry2 = new THREE.PlaneGeometry(4, 4 * 0.75)
  const loader = new THREE.TextureLoader()
  const material2 = new THREE.MeshPhongMaterial({
    map: loader.load('public/HandSanitizer.png')
  })
  const plane = new THREE.Mesh(geometry2, material2)
  plane.position.z = orientation.z
  plane.position.x = orientation.x
  plane.position.y = orientation.y
  return plane
}
