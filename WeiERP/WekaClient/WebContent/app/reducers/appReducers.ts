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
	APP_SET_TOKEN,
	GENERAL_ERROR,
	APP_LOGOUT,
    GENERAL_SUCCESS,
} from '../actions/appActions'
import {Reducer,AppState} from './reducerTypes';
import config from '../configs/config'
import { Error, User, Success } from '../models/modelTypes';
import { plainToClass } from "class-transformer";

const defaultLanguage = config.localization.defaultLanguage;

export const INITIAL_APP_STATE : AppState = Object.assign(new AppState(),{
	user: null,	
	isSmallMenuMode:false,
	error: null,
	isAppProceeding: false,
  language : config.getLanguage(defaultLanguage),
});

let appReducer : Reducer<AppState> = (state : AppState = INITIAL_APP_STATE, action:Action<any>) => {
	let newState:AppState = Object.assign({},state,{
			alerts: [],
		});
	if(isType(action, GENERAL_ERROR)){
		//
		let {alerts} = newState;
		let error:Error = plainToClass(Error,action.payload);
		alerts.push(error);
		newState = Object.assign({},state,{
			alerts: alerts,
		});
	}else if(isType(action, GENERAL_SUCCESS)){
		//
		let {alerts} = newState;
		let success:Success = new Success();
		success.successCode = action.payload;
		alerts.push(success);
		newState = Object.assign({},state,{
			alerts: alerts,
		});
	}
	else if(isType(action, APP_TOGGLE_MENU)){
		let {isSmallMenuMode} = state;
		isSmallMenuMode = isSmallMenuMode?false:true;
		newState = Object.assign(new AppState(),state,{
			isSmallMenuMode: isSmallMenuMode,
		});
	}else if(isType(action, APP_LOGIN)){
		let user:User = action.payload;
		(window as any).sessionStorage.setItem("user", JSON.stringify(user));
		newState = Object.assign(new AppState(),state,{
			user: user,
		});
	}else if(isType(action, APP_LOGOUT)){
		newState = Object.assign(new AppState(),state,{
			user: null,
		});
	}else if(isType(action, APP_SET_TOKEN)){
		let token = action.payload;
		(window as any).sessionStorage.setItem("token", token);
		newState = Object.assign(new AppState(),state,{
			token: token,
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