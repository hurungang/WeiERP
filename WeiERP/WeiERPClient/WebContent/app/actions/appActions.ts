import {ActionCreator} from 'redux'
import {actionCreator,
	} from "./actionTypes"
import {User} from '../models/modelTypes'

export const APP_TOGGLE_MENU = actionCreator<void>('APP_TOGGLE_MENU');
export const APP_LOGIN = actionCreator<User>('APP_LOGIN');
