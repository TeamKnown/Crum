import {devAxios} from './devAxios'
import {SCALER} from '../components/utils'
// action types
export const SET_CRUM_INSTANCES = 'SET_CRUM_INSTANCES'

export const ADD_CRUM_INSTANCE = 'ADD_CRUM_INSTANCE'
import * as Location from 'expo-location'

// action creator
export const setCrumInstances = crumInstances => ({
  type: SET_CRUM_INSTANCES,
  crumInstances: crumInstances
})

export const addCrumInstance = crumInstance => ({
  type: ADD_CRUM_INSTANCE,
  crumInstance: crumInstance
})

// thunks
// export const fetchCrumInstances = () => {
//   return async dispatch => {
//     try {
//       const {data} = await devAxios.get('/api/cruminstances')

//       dispatch(setCrumInstances(data))
//     } catch (error) {
//       console.error('GET Error')
//     }
//   }
// }

// http://localhost:19001/api/cruminstances/nearme?radium=1000&latitudeIdx=407074&longitudeIdx=-740000
export const fetchNearByCrumInstances = (latitudeIdx, longitudeIdx) => {
  return async dispatch => {
    try {
      const {data} = await devAxios.get(
        `/api/cruminstances/nearme?radium=${SCALER}&latitudeIdx=${latitudeIdx}&longitudeIdx=${longitudeIdx}`
      )

      dispatch(setCrumInstances(data))
    } catch (error) {
      console.error('GET Error')
    }
  }
}

export const fetchUserCrumInstances = userId => {
  return async dispatch => {
    try {
      const {data} = await devAxios.get(`/api/cruminstances/user/${userId}`)

      dispatch(setCrumInstances(data))
    } catch (error) {
      console.error('GET Error')
    }
  }
}

export const postCrumInstance = (crumInstance, userId, crumId) => {
  return async dispatch => {
    try {
      const heading = await Location.getHeadingAsync()
      const headingInt = Math.floor(heading.magHeading)
      crumInstance.headingInt = headingInt
      // console.log(crumInstance)
      let {data} = await devAxios.post(
        `/api/cruminstances?userId=${userId}&crumId=${crumId}&direction=front`,
        crumInstance
      )
      // {data} = await devAxios.get(`/api/cruminstances/${data.id}`)
      dispatch(addCrumInstance(data))
    } catch (error) {
      console.error('POST Error')
    }
  }
}
//
const initialState = []
const crumInstancesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CRUM_INSTANCES:
      return action.crumInstances
    case ADD_CRUM_INSTANCE:
      return [...state, action.crumInstance]
    default:
      return state
  }
}
export default crumInstancesReducer
