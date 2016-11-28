import {ActionCreator} from 'redux';
import * as axios from 'axios';
import {IActionCreator, actionCreator,
	} from './actionTypes';
import {DataList, Order, Error} from '../models/modelTypes';

export const LOAD_ORDER_LIST = ()=>{
	return dispatch => {
		dispatch(LOAD_ORDER_LIST_PROCEEDING);
		const request = axios.get('api/order');
		request.then(response =>{
			dispatch(LOAD_ORDER_LIST_RECEIVED((DataList<Order>)response.data));
		}).catch(response=>{
			dispatch(GENERAL_ERROR("ORDER_API_ERROR",response.data));
		});
	}
};
export const LOAD_ORDER_LIST_PROCEEDING = actionCreator<void>('LOAD_ORDER_LIST_PROCEEDING');
export const LOAD_ORDER_LIST_RECEIVED = actionCreator<DataList<Order>>('LOAD_ORDER_LIST_RECEIVED');
export const GENERAL_ERROR = actionCreator<Error>('GENERAL_ERROR');
