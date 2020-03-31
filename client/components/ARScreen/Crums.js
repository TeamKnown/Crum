import ExpoTHREE, {THREE} from 'expo-three'

export const createPlane = async (color, imgUrl, orientation) => {
  const geometry = new THREE.PlaneGeometry(2, 2)
  const texture = await ExpoTHREE.loadTextureAsync({
    asset: imgUrl
  })
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    transparent: true
  })
  const plane = new THREE.Mesh(geometry, material)
  plane.position.z = orientation.z
  plane.position.x = orientation.x
  plane.position.y = orientation.y
  plane.rotation.y = Math.atan2(-orientation.x, -orientation.z) // make sure the text is facing us
  return plane
}
