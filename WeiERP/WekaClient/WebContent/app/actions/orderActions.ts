import { ActionCreator } from 'redux';
import * as axios from 'axios';
import {
  IActionCreator, actionCreator,
} from './actionTypes';
import { DataList, Order, Error } from '../models/modelTypes';
import { ClientErrorCode } from '../models/enums';
import { APIResult, BulkActionPayload } from 'WekaServer/model/models'
import { plainToClass } from "class-transformer"
import config from '../configs/config'
import { GENERAL_ERROR } from "./appActions";
import DataUtils from "../utils/dataUtils"

export const LOAD_ORDER_LIST = (id: string, token:string) => {
  return dispatch => {
    dispatch(ORDER_PROCEEDING());
    const request = axios.get(config.runtime.api.order,DataUtils.buildJWTAxiosData(token));
    request
      .then(response => {
        let result: APIResult = response.data as APIResult;
        if(result.successful){
          let orderList: DataList<Order> = new DataList<Order>(Order, result.payload);

          dispatch(LOAD_ORDER_LIST_RECEIVED(orderList));
          if (id) {
            dispatch(SHOW_ORDER_BY_ID(id));
          }
        }else{
          let error: Error = { errorCode: ClientErrorCode.ORDER_API_ERROR, errorDetail: result.errorMessage };
          dispatch(GENERAL_ERROR(error));
        }
        dispatch(ORDER_PROCEEDING_END());
      })
      .catch(response => {
        let error: Error = { errorCode: ClientErrorCode.ORDER_API_ERROR, errorDetail: response.message };
        dispatch(GENERAL_ERROR(error));
        dispatch(ORDER_PROCEEDING_END());
      });
  }
};
export const ORDER_PROCEEDING = actionCreator<void>('ORDER_PROCEEDING');
export const ORDER_PROCEEDING_END = actionCreator<void>('ORDER_PROCEEDING_END');
export const LOAD_ORDER_LIST_RECEIVED = actionCreator<DataList<Order>>('LOAD_ORDER_LIST_RECEIVED');
export const SHOW_ORDER = actionCreator<Order>('SHOW_ORDER');
export const SHOW_ORDER_BY_ID = actionCreator<string>('SHOW_ORDER_BY_ID');
export const CLOSE_CURRENT_ORDER = actionCreator<string>('CLOSE_CURRENT_ORDER');
export const ADD_ORDER = actionCreator<Order>('ADD_ORDER');

export const BULK_CHANGE_ORDERS = (payload:BulkActionPayload, token:string) => {
  return dispatch => {
    dispatch(ORDER_PROCEEDING());
    const request = axios.patch(config.runtime.api.order,DataUtils.buildJWTAxiosData(token,payload));
    request
      .then(response => {
        let result: APIResult = response.data as APIResult;
        if(result.successful){
          let orderList: DataList<Order> = new DataList<Order>(Order, result.payload);

          dispatch(LOAD_ORDER_LIST_RECEIVED(orderList));
        }else{
          let error: Error = { errorCode: ClientErrorCode.ORDER_API_ERROR, errorDetail: result.errorMessage };
          dispatch(GENERAL_ERROR(error));
        }
        dispatch(ORDER_PROCEEDING_END());
      })
      .catch((response) => {
        let error: Error = { errorCode: ClientErrorCode.ORDER_API_ERROR, errorDetail: response.message };
        dispatch(GENERAL_ERROR(error));
        dispatch(ORDER_PROCEEDING_END());
      });
  }
}

export const SAVE_ORDER = (order: Order, token: string) => {
  return dispatch => {
    dispatch(ORDER_PROCEEDING());
    const request = order.id===undefined?axios.post(config.runtime.api.order,DataUtils.buildJWTAxiosData(token,order)):axios.put(config.runtime.api.order,DataUtils.buildJWTAxiosData(token,order));
    request
      .then(response => {
        let result: APIResult = response.data as APIResult;
        if(result.successful){
          let savedOrder: Order = plainToClass(Order,result.payload as Order);

          dispatch(SAVE_ORDER_RECEIVED(savedOrder));
        }else{
          let error: Error = { errorCode: ClientErrorCode.ORDER_API_ERROR, errorDetail: result.errorMessage };
          dispatch(GENERAL_ERROR(error));
        }
        dispatch(ORDER_PROCEEDING_END());
      })
      .catch((response) => {
        let error: Error = { errorCode: ClientErrorCode.ORDER_API_ERROR, errorDetail: response.message };
        dispatch(GENERAL_ERROR(error));
        dispatch(ORDER_PROCEEDING_END());
      });
  }
};

export const SAVE_ORDER_RECEIVED = actionCreator<Order>('SAVE_ORDER_RECEIVED');