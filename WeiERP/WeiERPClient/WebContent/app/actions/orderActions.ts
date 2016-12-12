import {ActionCreator} from 'redux';
import * as axios from 'axios';
import {IActionCreator, actionCreator,
	} from './actionTypes';
import {DataList, Order, Error} from '../models/modelTypes';
import {Status} from '../models/enums';

export const LOAD_ORDER_LIST = (id:number)=>{
	return dispatch => {
		dispatch(ORDER_PROCEEDING());
		const request = axios.get('/');
		request.then(response =>{
//			let orderList = <DataList<Order>>response.data;
			let orderList = {
				header: {id:"ID",consigneeName:"Consignee Name",consigneeAddress:"Consignee Address"},
			  	data:	[
				  Object.assign(new Order(),{
              id:12345,
              consigneeName:"Harry",
              consigneeAddress:"1/13-15 Franklin Rd, Doncaster East 3109, Melbourne, Australia",
              consigneePhone:"13333331223",
              senderName: "Aodaily@Melbourne",
              senderAddress: "313 La trobe St, Melbourne CBD 3000, Melbourne",
              senderPhone:"03041111111",
              createTime: new Date(),
              orderItems: [
                {
                    id: 33333,
                    product: {
                      id: 44444,
                      productName: "Ashelay Defending Test Product",
                      productSummary: "El snort testosterone trophy driving gloves handsome gerry Richardson helvetica tousled street art master testosterone trophy driving gloves handsome gerry Richardson",
                      productPrice: 64.5,
                    },
                    productQuantity: 3,
                    productCost: 55,
                    productOrderPrice: 121
                }
              ],
              tax: 51.2,
              shipping: 0,
              paid: 0,
              paidTime: new Date(),
              status: Status.Pending,
          }),
				  Object.assign(new Order(),{

              id:54321,
              consigneeName:"Tim Pang",
              consigneeAddress:"32 Londeontle Crescent, Ferntree Gully 3109, Melbourne, Australia",
              consigneePhone:"13333331223",
              senderName: "Aodaily@Melbourne",
              senderAddress: "313 La trobe St, Melbourne CBD 3000, Melbourne",
              senderPhone:"03041111111",
              createTime: new Date(),
              orderItems: [
                {
                    id: 33333,
                    product: {
                      id: 44444,
                      productName: "Ashelay Defending Test Product",
                      productSummary: "El snort testosterone trophy driving gloves handsome gerry Richardson helvetica tousled street art master testosterone trophy driving gloves handsome gerry Richardson",
                      productPrice: 64.5,
                    },
                    productQuantity: 3,
                    productCost: 55,
                    productOrderPrice: 121
                },
                {
                    id: 66666,
                    product: {
                      id: 77777,
                      productName: "Need for Speed IV",
                      productSummary: "Wes Anderson umami biodiesel",
                      productPrice: 64.5,
                    },
                    productQuantity: 3,
                    productCost: 55,
                    productOrderPrice: 121
                }
              ],
              tax: 151.2,
              shipping: 10.0,
              paid: 0,
              paidTime: new Date(),
              status: Status.Pending,
        })]
			}
			 setTimeout(() => {
					dispatch(LOAD_ORDER_LIST_RECEIVED(orderList));
					if(id){
						dispatch(SHOW_ORDER_BY_ID(id));
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
export const SHOW_ORDER_BY_ID = actionCreator<number>('SHOW_ORDER_BY_ID');
export const GENERAL_ERROR = actionCreator<Error>('GENERAL_ERROR');
export const ADD_ORDER = actionCreator<Order>('ADD_ORDER');
