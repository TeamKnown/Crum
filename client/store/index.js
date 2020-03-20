import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import crumInstancesReducer from './crumInstances'
import locationsReducer from './locations'
import axios from 'axios'

export const devAxios = axios.create({
  baseURL: 'http://16c671a5.ngrok.io'
})

const reducer = combineReducers({
  crumInstances: crumInstancesReducer,
  locations: locationsReducer
})

const middleware = composeWithDevTools(
  // applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
  applyMiddleware(thunkMiddleware)
)
const store = createStore(reducer, middleware)

export default store
export * from './crumInstances'
export * from './locations'
