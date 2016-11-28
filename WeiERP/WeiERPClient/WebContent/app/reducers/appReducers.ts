/**
 * for application interface actions reducing
 */

import {Action,
	isType
	} from '../actions/actionTypes';
import {APP_TOGGLE_MENU, APP_LOGIN} from '../actions/appActions'
import {Reducer,AppState} from './reducerTypes';

const initialState : AppState = {
	user: null,	
	isSmallMenuMode:false
}

let appReducer : Reducer<AppState> = (state : AppState = initialState, action:Action<any>) => {
	let newState:AppState = state;
	if(isType(action, APP_TOGGLE_MENU)){
		let {isSmallMenuMode} = state;
		isSmallMenuMode = isSmallMenuMode?false:true;
		newState = (<any>Object).assign({},state,{
			isSmallMenuMode: isSmallMenuMode,
		});
	}else if(isType(action, APP_LOGIN)){
		let user = action.payload;
		newState = (<any>Object).assign({},state,{
			user: user,
		});
	}
  return newState;
}

export default appReducer;