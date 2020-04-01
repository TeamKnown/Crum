/* eslint-disable no-case-declarations */
import {devAxios} from './devAxios'
import {SCALER} from '../components/utils'
import * as Location from 'expo-location'
// action types
export const SET_CRUM_INSTANCES = 'SET_CRUM_INSTANCES'
export const ADD_CRUM_INSTANCE = 'ADD_CRUM_INSTANCE'
export const ADD_COMMENT_INSTANCE = 'ADD_COMMENT_INSTANCE'
export const DELETE_CRUM_INSTANCE = 'DELETE_CRUM_INSTANCE'
export const COLLECT_CRUM_INSTANCE = 'COLLECT_CRUM_INSTANCE'
export const EDIT_CRUM_INSTANCE = 'EDIT_CRUM_INSTANCE'

// action creator
export const setCrumInstances = crumInstances => ({
  type: SET_CRUM_INSTANCES,
  crumInstances: crumInstances
})

export const postedCrumInstance = crumInstance => ({
  type: ADD_CRUM_INSTANCE,
  crumInstance: crumInstance
})

export const postedCommentInstance = (commentInstance, crumInstanceId) => ({
  type: ADD_COMMENT_INSTANCE,
  commentInstance: commentInstance,
  crumInstanceId: crumInstanceId
})
export const deletedCrumInstance = crumInstance => ({
  type: DELETE_CRUM_INSTANCE,
  crumInstance: crumInstance
})

export const collectedCrumInstance = crumInstance => ({
  type: COLLECT_CRUM_INSTANCE,
  crumInstance: crumInstance
})
export const putedCrumInstance = crumInstance => ({
  type: EDIT_CRUM_INSTANCE,
  crumInstance: crumInstance
})

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

// //!!!new version is named  fetchUserDroppedCrumInstances
// export const fetchUserCrumInstances = userId => {
//   return async dispatch => {
//     try {
//       const {data} = await devAxios.get(`/api/cruminstances/user/${userId}`)

//       dispatch(setCrumInstances(data))
//     } catch (error) {
//       console.error('GET Error')
//     }
//   }
// }

// //!!!new version is named  fetchUserCollectedCrumInstances
// export const fetchCollectedCrumInstances = userId => {
//   return async dispatch => {
//     try {
//       const {data} = await devAxios.get(`/api/cruminstances/collect/${userId}`)

//       dispatch(setCrumInstances(data))
//     } catch (error) {
//       console.error('GET Error')
//     }
//   }
// }

export const postCrumInstance = (crumInstance, userId, crumId) => {
  return async dispatch => {
    try {
      const heading = await Location.getHeadingAsync()
      const headingInt = Math.floor(heading.magHeading)
      crumInstance.headingInt = headingInt
      let {data} = await devAxios.post(
        `/api/cruminstances?userId=${userId}&crumId=${crumId}&direction=front`,
        crumInstance
      )
      dispatch(postedCrumInstance(data))
    } catch (error) {
      console.error('POST Error')
    }
  }
}

export const postCommentInstance = (commentInstance, crumInstanceId) => {
  return async dispatch => {
    try {
      let {data} = await devAxios.post(
        `/api/commentinstances?crumInstanceId=${crumInstanceId}`,
        commentInstance
      )
      dispatch(postedCommentInstance(data, crumInstanceId))
    } catch (error) {
      console.error('POST Error')
    }
  }
}

export const deleteCrumInstance = crumInstance => {
  return async dispatch => {
    try {
      const heading = await Location.getHeadingAsync()
      const headingInt = Math.floor(heading.magHeading)
      crumInstance.headingInt = headingInt
      let {data} = await devAxios.delete(
        `/api/cruminstances/${crumInstance.id}`,
        crumInstance
      )
      dispatch(deletedCrumInstance(crumInstance))
    } catch (error) {
      console.error('POST Error')
    }
  }
}

export const collectCrumInstance = crumInstance => {
  return async dispatch => {
    try {
      const heading = await Location.getHeadingAsync()
      const headingInt = Math.floor(heading.magHeading)
      crumInstance.headingInt = headingInt
      let {data} = await devAxios.put(
        `/api/cruminstances/collect/${crumInstance.id}`,
        crumInstance
      )
      dispatch(collectedCrumInstance(data))
    } catch (error) {
      console.error('POST Error')
    }
  }
}

export const putCrumInstance = crumInstance => {
  return async dispatch => {
    try {
      const heading = await Location.getHeadingAsync()
      const headingInt = Math.floor(heading.magHeading)
      crumInstance.headingInt = headingInt
      let {data} = await devAxios.put(
        `/api/cruminstances/${crumInstance.id}`,
        crumInstance
      )
      dispatch(putedCrumInstance(data))
    } catch (error) {
      console.error('POST Error')
    }
  }
}
const initialState = []
const crumInstancesNearbyReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CRUM_INSTANCES:
      console.log('OLD SHARED REDUCER: SET_CRUM_INSTANCES')
      console.log(action.crumInstances.map(elm => elm.message))
      return action.crumInstances
    case ADD_CRUM_INSTANCE:
      return [...state, action.crumInstance]
    case DELETE_CRUM_INSTANCE:
      let stateAfterDelete = state.filter(
        elm => elm.id !== +action.crumInstance.id
      )
      return stateAfterDelete
    case COLLECT_CRUM_INSTANCE:
      console.log('for free for all, things still there after collection')
      // console.log(state.map(elm => elm.message))
      // console.log(action.crumInstance.id)
      let stateAfterCollect = state.filter(
        elm => elm.id !== +action.crumInstance.id
      )
      // console.log(stateAfterCollect.map(elm => elm.message))
      return stateAfterCollect

    case EDIT_CRUM_INSTANCE:
      let stateAfterEdit = state.map(elm =>
        elm.id !== +action.crumInstance.id ? elm : action.crumInstance
      )

      return stateAfterEdit
    case ADD_COMMENT_INSTANCE:
      let crumAfterComment = state.filter(
        elm => elm.id === +action.crumInstanceId
      )[0]
      crumAfterComment.CommentInstances = [
        ...crumAfterComment.CommentInstances,
        action.commentInstance
      ]
      let stateAfterComment = state.map(elm =>
        elm.id !== +action.crumInstanceId ? elm : crumAfterComment
      )

      return stateAfterComment
    default:
      return state
  }
}
export default crumInstancesNearbyReducer
