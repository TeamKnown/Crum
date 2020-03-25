import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import crumInstancesReducer from './crumInstances'
import crumsReducer from './crums'
import locationsReducer from './locations'
import userReducer from './user'

const reducer = combineReducers({
  user: userReducer,
  crumInstances: crumInstancesReducer,
  crums: crumsReducer,
  locations: locationsReducer
})

const middleware = composeWithDevTools(applyMiddleware(thunkMiddleware))
const store = createStore(reducer, middleware)

export default store
export * from './crumInstances'
export * from './locations'
export * from './crums'
export * from './user'
