import {devAxios} from './devAxios'
import {Asset} from 'expo-asset'
import ExpoTHREE from 'expo-three'
// action types

export const GET_CRUM = 'GET_CRUM'

// action creator

export const getCrums = crums => ({
  type: GET_CRUM,
  crums: crums
})

// thunks
export const fetchCrums = () => {
  return async dispatch => {
    try {
      const {data} = await devAxios.get('/api/crums')
      dispatch(getCrums(data))
    } catch (error) {
      console.error('GET Error')
    }
  }
}

const initialState = []
const crumsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CRUM:
      return [...action.crums]
    default:
      return state
  }
}
export default crumsReducer
