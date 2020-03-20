import {devAxios} from './devAxios'
// action types
export const SET_CRUM_INSTANCES = 'SET_CRUM_INSTANCES'

export const ADD_CRUM_INSTANCE = 'ADD_CRUM_INSTANCE'

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
        `/api/cruminstances/nearme?radium=${3}&latitudeIdx=${latitudeIdx}&longitudeIdx=${longitudeIdx}`
      )

      dispatch(setCrumInstances(data))
    } catch (error) {
      console.error('GET Error')
    }
  }
}

export const postCrumInstance = newCrum => {
  return async dispatch => {
    try {
      console.log(newCrum)
      console.dir(devAxios)
      const {data} = await devAxios.post('/api/cruminstances', newCrum)
      dispatch(addCrumInstance(data))
    } catch (error) {
      console.error('POST Error')
    }
  }
}

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
