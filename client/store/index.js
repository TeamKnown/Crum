import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import crumInstancesReducer from './crumInstances'
import locationsReducer from './locations'
import axios from 'axios'

// Peter
// export const devAxios = axios.create({
//   baseURL: 'http://1b85c921.ngrok.io'
// })
// local
export const devAxios = axios.create({
  baseURL: 'http://c78e4eaa.ngrok.io'
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
