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
  // const heading = await Location.getHeadingAsync()
  // console.log(heading)
  // let {status} = await Permissions.askAsync(Permissions.LOCATION)
  positionTracker = setInterval(async () => {
    const heading = await Location.getHeadingAsync()
    const location = await Location.getCurrentPositionAsync()
    dispatch(
      getUpdatedPosition({
        heading: heading.magHeading,
        altitude: location.coords.altitude,
        longitude: location.coords.longitude
      })
    )
    // Location.getCurrentPositionAsync({enableHighAccuracy: true})
    //   .then(res =>
    //     dispatch(
    //       getUpdatedPosition({
    //         latitude: res.coords.latitude,
    //         longitude: res.coords.longitude
    //       })
    //     )
    //   )
    //   .catch(err => console.error(err))
  }, 300)
}

const initialState = {
  // longitude: 'unknown', //Initial Longitude
  // latitude: 'unknown', //Initial Latitude
  // heading: 'unknown'
  // location:
  // headingSubscription: undefined
}
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
