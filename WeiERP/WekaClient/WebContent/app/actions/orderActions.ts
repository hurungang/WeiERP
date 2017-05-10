import { ActionCreator } from 'redux';
import * as axios from 'axios';
import {
  IActionCreator, actionCreator,
} from './actionTypes';
import { DataList, Order, Error } from '../models/modelTypes';
import { Status } from '../models/enums';
import { APIResult } from 'WekaServer/model/models'
import { plainToClass } from "class-transformer"

export const LOAD_ORDER_LIST = (id: string) => {
  return dispatch => {
    dispatch(ORDER_PROCEEDING());
    const request = axios.get('http://localhost:3000/order/');
    request
      .then(response => {
        let result: APIResult = response.data as APIResult;
        let orderList: DataList<Order> = new DataList<Order>(Order, result.payload);

        dispatch(LOAD_ORDER_LIST_RECEIVED(orderList));
        if (id) {
          dispatch(SHOW_ORDER_BY_ID(id));
        }
        dispatch(ORDER_PROCEEDING_END());
      })
      .catch(response => {
        let error: Error = { errorCode: "ORDER_API_ERROR", errorDetail: response };
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
export const GENERAL_ERROR = actionCreator<Error>('GENERAL_ERROR');
export const ADD_ORDER = actionCreator<Order>('ADD_ORDER');
export const SAVE_ORDER = (order: Order) => {
  return dispatch => {
    dispatch(ORDER_PROCEEDING());
    const request = axios.put('http://localhost:3000/order/',order);
    request
      .then(response => {
        let result: APIResult = response.data as APIResult;
        let savedOrder: Order = plainToClass(Order,result.payload as Order);

        dispatch(SAVE_ORDER_RECEIVED(savedOrder));
        dispatch(ORDER_PROCEEDING_END());
      })
      .catch(response => {
        let error: Error = { errorCode: "ORDER_API_ERROR", errorDetail: response };
        dispatch(GENERAL_ERROR(error));
        dispatch(ORDER_PROCEEDING_END());
      });
  }
};

export const SAVE_ORDER_RECEIVED = actionCreator<Order>('SAVE_ORDER_RECEIVED');