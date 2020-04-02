import axios from 'axios'
import {devAxios} from './devAxios'
import {NavigationActions} from 'react-navigation'

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'
const UPDATE_USER = 'UPDATE_USER'
const TOGGLE_SHOWSLIDES = 'TOGGLE_SHOWSLIDES'

/**
 * ACTION CREATORS
 */
const getUser = user => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})
const updateUser = user => ({
  type: UPDATE_USER,
  user
})
const toggleShowSlides = user => ({type: TOGGLE_SHOWSLIDES, user})

/**
 * THUNK CREATORS
 */

const defaultUser = {
  id: 0,
  userName: 'Guest',
  email: 'Email',
  googleId: null,
  type: 'user',
  address: '',
  zip: '',
  phone: '',
  showSlidesAgain: 'true'
}
export const me = () => async dispatch => {
  try {
    const res = await devAxios.get('/auth/me')
    dispatch(getUser(res.data || defaultUser))
  } catch (err) {
    console.error(err)
  }
}

export const auth = (userName, password, method) => async dispatch => {
  let res
  try {
    res = await devAxios.post(`/auth/${method}`, {userName, password})
  } catch (authError) {
    return dispatch(getUser({error: authError}))
  }

  try {
    dispatch(getUser(res.data))
    NavigationActions.navigate('Profile')
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const logout = () => async dispatch => {
  try {
    await devAxios.post('/auth/logout')
    dispatch(removeUser())
    NavigationActions.navigate('SignIn')
  } catch (err) {
    console.error(err)
  }
}

export const getSingleUser = id => {
  return async dispatch => {
    try {
      const {data} = await devAxios.get(`/api/users/${id}`)
      dispatch(getUser(data))
    } catch (error) {
      console.error(error)
    }
  }
}

export const updateUserThunk = (id, info) => {
  return async dispatch => {
    try {
      const {data} = await devAxios.put(`/api/users/${id}`, info)

      dispatch(updateUser(data))
    } catch (error) {
      console.error(error)
    }
  }
}

export const toggleShowSlidesAgain = id => {
  return async dispatch => {
    try {
      const {data} = await devAxios.put(`/api/users/${id}`, {
        showSlidesAgain: 'false'
      })

      dispatch(toggleShowSlides(data))
    } catch (error) {
      console.error(error)
    }
  }
}

/**
 * INITIAL STATE
 */

/**
 * REDUCER
 */
export default function(state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user
    case REMOVE_USER:
      return defaultUser
    case UPDATE_USER:
      return action.user
    case TOGGLE_SHOWSLIDES:
      return action.user
    default:
      return state
  }
}
