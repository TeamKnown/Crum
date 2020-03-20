import {Renderer, THREE} from 'expo-three'

export const createCube = () => {
  const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4)
  // Simple color material
  const material = new THREE.MeshPhongMaterial({
    color: 0xff00ff
  })
  const cube = new THREE.Mesh(geometry, material)
  cube.position.z = -2
  cube.position.x = 1
  cube.position.y = 1
  return cube
}

export const createPlane = () => {
  const geometry2 = new THREE.PlaneGeometry(2, 2 * 0.75)
  const loader = new THREE.TextureLoader()
  const material2 = new THREE.MeshPhongMaterial({
    map: loader.load('public/HandSanitizer.png')
  })
  const plane = new THREE.Mesh(geometry2, material2)
  plane.position.z = -3
  return plane
}
