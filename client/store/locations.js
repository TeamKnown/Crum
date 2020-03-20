// import {devAxios} from './devAxios'
import * as Location from 'expo-location'

let positionTracker = null
const SUBSCRIBE_LOCATION = 'SUBSCRIBE_LOCATION'
const UNSUBSCRIBE_LOCATION = 'UNSUBSCRIBE_LOCATION'

export const getUpdatedPosition = position => ({
  type: SUBSCRIBE_LOCATION,
  position
})
export const stopTracking = () => ({type: UNSUBSCRIBE_LOCATION})

export const getCurrentPosition = () => async dispatch => {
  clearInterval(positionTracker)
  positionTracker = setInterval(async () => {
    const heading = await Location.getHeadingAsync()
    const location = await Location.getCurrentPositionAsync()
    dispatch(
      getUpdatedPosition({
        heading: heading.magHeading,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      })
    )
  }, 1200)
}

const initialState = {}
const locationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUBSCRIBE_LOCATION:
      return {
        ...action.position
      }
    case UNSUBSCRIBE_LOCATION:
      clearInterval(positionTracker)
      return {...state}
    default:
      return state
  }
}
export default locationsReducer
