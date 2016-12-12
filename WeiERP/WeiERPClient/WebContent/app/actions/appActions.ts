import {ActionCreator} from 'redux'
import {actionCreator,
	} from "./actionTypes"
import {User} from '../models/modelTypes'

export const APP_TOGGLE_MENU = actionCreator<void>('APP_TOGGLE_MENU');
export const APP_LOGIN = actionCreator<User>('APP_LOGIN');
export const APP_PROCEEDING = actionCreator<User>('APP_PROCEEDING');
export const APP_PROCEEDING_END = actionCreator<User>('APP_PROCEEDING_END');
export const APP_CHANGE_LANGUAGE = actionCreator<string>('APP_CHANGE_LANGUAGE');
