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
// ipad pro - all models
// ipad air 3rd gen
// ipad mini 5th gen
// ipad 5th gen
// ipod touch 7th gen

export const checkIphoneModel = () => {
  console.log(Device.modelName)
  switch (Device.modelName) {
    case 'iPhone':
      return 'noAR'
    case 'iPhone 3G':
      return 'noAR'
    case 'iPhone 3GS':
      return 'noAR'
    case 'iPhone 4':
      return 'noAR'
    case 'iPhone 4S':
      return 'noAR'
    case 'iPhone 5':
      return 'noAR'
    case 'iPhone 5s':
      return 'noAR'
    case 'iPhone 5c':
      return 'noAR'
    case 'iPhone 6':
      return 'noAR'
    case 'iPhone 6 Plus':
      return 'noAR'
    case 'iPhone SE':
      return 'noAR'
    case 'iPad':
      return 'noAR'
    case 'iPad 2':
      return 'noAR'
    case 'iPad Mini':
      return 'noAR'
    case 'iPad Mini 2':
      return 'noAR'
    case 'iPad Mini 3':
      return 'noAR'
    case 'iPad Mini 4':
      return 'noAR'
    case 'iPhone 6s':
      return 'standard'
    case 'iPhone 6s Plus':
      return 'standard'
    case 'iPhone 7':
      return 'standard'
    case 'iPhone 7 Plus':
      return 'standard'
    case 'iPhone 8':
      return 'standard'
    case 'iPhone 8 Plus':
      return 'standard'
    default:
      return 'advanced'
  }
}
