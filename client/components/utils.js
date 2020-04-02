import queryString from 'query-string'
import * as Device from 'expo-device'
import {devAxios} from '../store/devAxios'

export const howLongAgo = date => {
  const minutesPassed = Math.floor((Date.now() - Date.parse(date)) / 60000)
  if (minutesPassed < 60) {
    return minutesPassed <= 1
      ? `${minutesPassed} minute ago`
      : `${minutesPassed} minutes ago`
  }
  const hoursPassed = Math.floor(minutesPassed / 60)
  if (hoursPassed < 24) {
    return hoursPassed === 1 ? `1 hour ago` : `${hoursPassed} hours ago`
  }
  const daysPassed = Math.floor(hoursPassed / 24)
  if (daysPassed < 24) {
    return daysPassed === 1 ? 'a day ago' : `${daysPassed} days ago`
  }
}

export const userNameExists = async userName => {
  const {data} = await devAxios.get(`/api/users/exists/?userName=${userName}`)
  return data.exists
}

export const userCollectedThis = async (userId, crumInstanceId) => {
  const {data} = await devAxios.get(
    `/api/users/userCollectedThis/?userId=${userId}&crumInstanceId=${crumInstanceId}`
  )
  return data.exists
}

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
    crumInstance.crum.name +
    '&type=crum'
  )
}

export const outlineInstanceNamer = crumInstance => {
  return (
    'crumInstanceId=' +
    crumInstance.id +
    '&curmId' +
    crumInstance.crum.id +
    '&curmName=' +
    crumInstance.crum.name +
    '&type=outline'
  )
}

export const crumInstanceParser = crumInstanceName => {
  return queryString.parse(crumInstanceName)
}

const iphoneModel = {
  iPhone: 'noAR',
  'iPhone 3G': 'noAR',
  'iPhone 3GS': 'noAR',
  'iPhone 4': 'noAR',
  'iPhone 4S': 'noAR',
  'iPhone 5': 'noAR',
  'iPhone 5s': 'noAR',
  'iPhone 5c': 'noAR',
  'iPhone 6': 'noAR',
  'iPhone 6 Plus': 'noAR',
  'iPhone SE': 'noAR',
  iPad: 'noAR',
  'iPad 2': 'noAR',
  'iPad Mini': 'noAR',
  'iPad Mini 2': 'noAR',
  'iPad Mini 3': 'noAR',
  'iPad Mini 4': 'noAR',
  'iPhone 6s': 'standard',
  'iPhone 6s Plus': 'standard',
  'iPhone 7': 'standard',
  'iPhone 7 Plus': 'standard',
  'iPhone 8': 'standard',
  'iPhone 8 Plus': 'standard'
}
export const checkIphoneModel = () => {
  if (Device.modelName === null) {
    return 'noAr'
  } else if (iphoneModel[Device.modelName]) {
    return iphoneModel[Device.modelName]
  } else {
    return 'advanced'
  }
}
