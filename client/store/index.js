import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import crumInstancesNearbyReducer from './crumInstancesNearby'
import crumInstancesCollectedReducer from './crumInstancesCollected'
import crumInstancesDroppedReducer from './crumInstancesDropped'
import crumsReducer from './crums'
import locationsReducer from './locations'
import userReducer from './user'

const reducer = combineReducers({
  user: userReducer,
  crumInstancesNearby: crumInstancesNearbyReducer,
  crumInstancesCollected: crumInstancesCollectedReducer,
  crumInstancesDropped: crumInstancesDroppedReducer,
  crums: crumsReducer,
  locations: locationsReducer
})

const middleware = composeWithDevTools(applyMiddleware(thunkMiddleware))

const store = createStore(reducer, middleware)

export default store
export * from './crumInstancesNearby'
export * from './crumInstancesCollected'
export * from './crumInstancesDropped'
export * from './locations'
export * from './crums'
export * from './user'
