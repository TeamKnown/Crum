import {devAxios} from './devAxios'
export const SET_USER_DROPPED_CRUM_INSTANCES = 'SET_USER_DROPPED_CRUM_INSTANCES'
export const setUserDroppedCrumInstances = crumInstances => ({
  type: SET_USER_DROPPED_CRUM_INSTANCES,
  crumInstances: crumInstances
})

export const fetchUserDroppedCrumInstances = userId => {
  return async dispatch => {
    try {
      const {data} = await devAxios.get(`/api/cruminstances/user/${userId}`)

      dispatch(setUserDroppedCrumInstances(data))
    } catch (error) {
      console.error('GET Error')
    }
  }
}
const initialState = []
const crumInstancesDroppedReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_DROPPED_CRUM_INSTANCES:
      return action.crumInstances
    default:
      return state
  }
}
export default crumInstancesDroppedReducer
