import ExpoTHREE, {THREE} from 'expo-three'

export const createPlane = async (imgUrl, position) => {
  const geometry = new THREE.PlaneGeometry(2, 2)
  const texture = await ExpoTHREE.loadTextureAsync({
    asset: imgUrl
  })
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    transparent: true
  })
  const plane = new THREE.Mesh(geometry, material)
  plane.material.side = THREE.DoubleSide
  plane.position.z = position.z
  plane.position.x = position.x
  plane.position.y = position.y
  plane.rotation.y = Math.atan2(-position.x, -position.z) // make sure the text is facing us
  return plane
}

export const createPlaneOutline = (color, position) => {
  const geometry = new THREE.RingGeometry(1.3, 1.4, 32)
  var outlineMaterial = new THREE.MeshBasicMaterial({
    color: color
  })
  const plane = new THREE.Mesh(geometry, outlineMaterial)
  plane.material.side = THREE.DoubleSide
  plane.position.z = position.z
  plane.position.x = position.x
  plane.position.y = position.y
  plane.rotation.y = Math.atan2(-position.x, -position.z) // make sure the text is facing us
  return plane
}
