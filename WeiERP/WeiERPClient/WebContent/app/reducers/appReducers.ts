/**
 * for application interface actions reducing
 */

import {Action,
	isType
	} from '../actions/actionTypes';
import {APP_TOGGLE_MENU, APP_LOGIN, APP_PROCEEDING,APP_PROCEEDING_END} from '../actions/appActions'
import {Reducer,AppState} from './reducerTypes';

const initialState : AppState = {
	user: null,	
	isSmallMenuMode:false,
	error: null,
	isAppProceeding: false,
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
	}else if(isType(action, APP_PROCEEDING)){
		newState = (<any>Object).assign({},state,{
			isAppProceeding: true,
		});
	}else if(isType(action, APP_PROCEEDING_END)){
		newState = (<any>Object).assign({},state,{
			isAppProceeding: false,
		});
	}
  return newState;
}

export default appReducer;