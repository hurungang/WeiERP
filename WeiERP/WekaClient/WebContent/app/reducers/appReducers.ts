/**
 * for application interface actions reducing
 */

import {Action,
	isType
	} from '../actions/actionTypes';
import {APP_TOGGLE_MENU, 
  APP_LOGIN, 
  APP_PROCEEDING,
  APP_PROCEEDING_END,
  APP_CHANGE_LANGUAGE,
} from '../actions/appActions'
import {Reducer,AppState} from './reducerTypes';
import config from '../configs/config'

const defaultLanguage = config.localization.defaultLanguage;

export const INITIAL_APP_STATE : AppState = Object.assign(new AppState(),{
	user: null,	
	isSmallMenuMode:false,
	error: null,
	isAppProceeding: false,
  language : config.getLanguage(defaultLanguage),
});

let appReducer : Reducer<AppState> = (state : AppState = INITIAL_APP_STATE, action:Action<any>) => {
	let newState:AppState = state;
	if(isType(action, APP_TOGGLE_MENU)){
		let {isSmallMenuMode} = state;
		isSmallMenuMode = isSmallMenuMode?false:true;
		newState = Object.assign(new AppState(),state,{
			isSmallMenuMode: isSmallMenuMode,
		});
	}else if(isType(action, APP_LOGIN)){
		let user = action.payload;
		newState = Object.assign(new AppState(),state,{
			user: user,
		});
	}else if(isType(action, APP_PROCEEDING)){
		newState = Object.assign(new AppState(),state,{
			isAppProceeding: true,
		});
	}else if(isType(action, APP_PROCEEDING_END)){
		newState = Object.assign(new AppState(),state,{
			isAppProceeding: false,
		});
	}else if(isType(action, APP_CHANGE_LANGUAGE)){
    let languageName = action.payload;
		let language = config.getLanguage(languageName);
    newState = Object.assign(new AppState(),state,{
      language: language
    });
  }
  return newState;
}

export default appReducer;