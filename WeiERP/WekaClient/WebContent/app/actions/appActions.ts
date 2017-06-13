import { ActionCreator } from 'redux'
import * as axios from 'axios';
import {
  actionCreator,
} from "./actionTypes"
import { User, Error, APIResult } from '../models/modelTypes'
import config from '../configs/config'
import { ClientErrorCode } from "../models/enums";

export const APP_TOGGLE_MENU = actionCreator<void>('APP_TOGGLE_MENU');
export const APP_AUTHENTICATE_USER = (user: User) => {
  return dispatch => {
    dispatch(APP_PROCEEDING());
    const request = axios.post(config.runtime.api.authentication,user);
    request
      .then(response => {
        let result: APIResult = response.data as APIResult;
        if (result.successful) {
          let user: User = result.payload as User;
          dispatch(APP_LOGIN(user));
          dispatch(APP_SET_TOKEN(result.token));
        } else {
          let error: Error = { errorCode: ClientErrorCode.USER_INVALID_ERROR, errorDetail: result.errorMessage };
          dispatch(GENERAL_ERROR(error));
        }
        dispatch(APP_PROCEEDING_END());
      })
      .catch(response => {
        let error: Error = { errorCode: ClientErrorCode.USER_API_ERROR, errorDetail: response.message };
        dispatch(GENERAL_ERROR(error));
        dispatch(APP_PROCEEDING_END());
      });
  }
}


export const APP_AUTHENTICATE_USER_VIA_TOKEN = (token: String) => {
  return dispatch => {
    dispatch(APP_PROCEEDING());
    const request = axios.post(config.runtime.api.authentication,{token});
    request
      .then(response => {
        let result: APIResult = response.data as APIResult;
        if (result.successful) {
          let user: User = result.payload as User;
          dispatch(APP_LOGIN(user));
          dispatch(APP_SET_TOKEN(result.token));
        } else {
          let error: Error = { errorCode: ClientErrorCode.USER_INVALID_ERROR, errorDetail: result.errorMessage };
          dispatch(GENERAL_ERROR(error));
        }
        dispatch(APP_PROCEEDING_END());
      })
      .catch(response => {
        let error: Error = { errorCode: ClientErrorCode.USER_API_ERROR, errorDetail: response.message };
        dispatch(GENERAL_ERROR(error));
        dispatch(APP_PROCEEDING_END());
      });
  }
}

export const APP_REGISTER_USER = (user: User) => {
  return dispatch => {
    dispatch(APP_PROCEEDING());
    const request = axios.put(config.runtime.api.authentication,user);
    request
      .then(response => {
        let result: APIResult = response.data as APIResult;
        if (result.successful) {
          let user: User = result.payload as User;
          dispatch(APP_LOGIN(user));
          dispatch(APP_SET_TOKEN(result.token));
        } else {
          let error: Error = { errorCode: ClientErrorCode.USER_INVALID_ERROR, errorDetail: result.errorMessage };
          dispatch(GENERAL_ERROR(error));
        }
        dispatch(APP_PROCEEDING_END());
      })
      .catch(response => {
        let error: Error = { errorCode: ClientErrorCode.USER_API_ERROR, errorDetail: response.message };
        dispatch(GENERAL_ERROR(error));
        dispatch(APP_PROCEEDING_END());
      });
  }
}
export const APP_LOGIN = actionCreator<User>('APP_LOGIN');
export const APP_LOGOUT = actionCreator<User>('APP_LOGOUT');
export const APP_SET_TOKEN = actionCreator<string>('APP_SET_TOKEN');
export const APP_PROCEEDING = actionCreator<User>('APP_PROCEEDING');
export const APP_PROCEEDING_END = actionCreator<User>('APP_PROCEEDING_END');
export const APP_CHANGE_LANGUAGE = actionCreator<string>('APP_CHANGE_LANGUAGE');
export const GENERAL_ERROR = actionCreator<Error>('GENERAL_ERROR');
