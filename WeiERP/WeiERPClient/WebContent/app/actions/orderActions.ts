import {ActionCreator} from 'redux';
import * as axios from 'axios';
import {IActionCreator, actionCreator,
	} from './actionTypes';
import {DataList, Order, Error} from '../models/modelTypes';

export const LOAD_ORDER_LIST = (id:number)=>{
	return dispatch => {
		dispatch(ORDER_PROCEEDING());
		const request = axios.get('/');
		request.then(response =>{
//			let orderList = <DataList<Order>>response.data;
			let orderList = {
				header: {id:"ID",consigneeName:"Consignee Name",consigneeAddress:"Consignee Address"},
			  	data:	[
				  {id:12345,consigneeName:"Harry",consigneeAddress:"1/13-15 Franklin Rd, Doncaster East 3109, Melbourne, Australia"},
				  {id:23456,consigneeName:"Tom",consigneeAddress:"Sydney"}]
			}
			 setTimeout(() => {
					dispatch(LOAD_ORDER_LIST_RECEIVED(orderList));
					if(id){
						dispatch(SHOW_ORDER_BY_ID({orderList,id}));
					}
					dispatch(ORDER_PROCEEDING_END());
				  }, 1000)
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
export const SHOW_ORDER_BY_ID = actionCreator<{orderList:DataList<Order>,id:number}>('SHOW_ORDER_BY_ID');
export const GENERAL_ERROR = actionCreator<Error>('GENERAL_ERROR');
