import {devAxios} from './devAxios'
export const SET_USER_COLLECTED_CRUM_INSTANCES =
  'SET_USER_COLLECTED_CRUM_INSTANCES'
export const setUseCollectedCrumInstances = crumInstances => ({
  type: SET_USER_COLLECTED_CRUM_INSTANCES,
  crumInstances: crumInstances
})

export const fetchUserCollectedCrumInstances = userId => {
  return async dispatch => {
    try {
      const {data} = await devAxios.get(`/api/cruminstances/collect/${userId}`)

      dispatch(setUseCollectedCrumInstances(data))
    } catch (error) {
      console.error('GET Error')
    }
  }
}

const initialState = []
const crumInstancesCollectedReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_COLLECTED_CRUM_INSTANCES:
      return action.crumInstances
    default:
      return state
  }
}
export default crumInstancesCollectedReducer
