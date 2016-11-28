import {ActionCreator} from 'redux';
import * as axios from 'axios';
import {IActionCreator, actionCreator,
	} from './actionTypes';
import {DataList, Order, Error} from '../models/modelTypes';

export const LOAD_ORDER_LIST = ()=>{
	return dispatch => {
		dispatch(ORDER_PROCEEDING());
		const request = axios.get('/');
		request.then(response =>{
//			let orderList = <DataList<Order>>response.data;
			let orderList = {
				header: {id:"ID",consigneeName:"Consignee Name",consigneeAddress:"Consignee Address"},
			  	data:	[
				  {id:1,consigneeName:"Harry",consigneeAddress:"Melbourne"},
				  {id:1,consigneeName:"Tom",consigneeAddress:"Sydney"}]
			}
			 setTimeout(() => {
					dispatch(LOAD_ORDER_LIST_RECEIVED(orderList));
					dispatch(ORDER_PROCEEDING_END());
				  }, 4000)
		}).catch(response=>{
			let error:Error = {errorCode:"ORDER_API_ERROR",errorDetail:response};
			dispatch(GENERAL_ERROR(error));
			dispatch(ORDER_PROCEEDING_END());
		});
	}
};
export const ORDER_PROCEEDING = actionCreator<void>('ORDER_PROCEEDING');
export const ORDER_PROCEEDING_END = actionCreator<void>('ORDER_PROCEEDING_END');
export const LOAD_ORDER_LIST_RECEIVED = actionCreator<DataList<Order>>('LOAD_ORDER_LIST_RECEIVED');
export const SHOW_ORDER = actionCreator<Order>('SHOW_ORDER');
export const GENERAL_ERROR = actionCreator<Error>('GENERAL_ERROR');
