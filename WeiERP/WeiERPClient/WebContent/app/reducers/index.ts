import { combineReducers } from 'redux'
import appReducers from './appReducers'
import orderReducers from './orderReducers'

export default combineReducers({
	appState: appReducers,
	orderState: orderReducers,
})