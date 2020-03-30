import queryString from 'query-string'
import * as Device from 'expo-device'

export const computePos = (crumInstance, locations) => {
  const z = // positive z means to the south, this should be correct
    (-(crumInstance.latitude - locations.latitude) * 6356000 * 3.14 * 2) / 360.0
  const x = // more negative longitude means positive x means to the east
    ((crumInstance.longitude - locations.longitude) *
      6356000 *
      3.14 *
      Math.cos((locations.longitude * 2 * 3.14) / 360) *
      2) /
    360.0
  const y = 0
  return {x, y, z}
}
export const SCALER = 1000

export const crumInstanceNamer = crumInstance => {
  return (
    'crumInstanceId=' +
    crumInstance.id +
    '&curmId' +
    crumInstance.crum.id +
    '&curmName=' +
    crumInstance.crum.name
  )
}

export const crumInstanceParser = crumInstanceName => {
  return queryString.parse(crumInstanceName)
}

export const checkIphoneModel = () => {
  console.log(Device.modelName)
  switch (Device.modelName) {
    case 'iPhone 4':
      return false
    case 'iPhone 4s':
      return false
    case 'iPhone 5':
      return false
    case 'iPhone 5s':
      return false
    case 'iPhone 6':
      return false
    case 'iPhone 6 Plus':
      return false
    case 'iPhone SE':
      return false
    default:
      return true
  }
}
