import {Reducer,OrderState} from './reducerTypes';
import {Action,
	isType
	} from '../actions/actionTypes';
import {Order,DataList} from '../models/modelTypes';
import {GENERAL_ERROR, LOAD_ORDER_LIST_RECEIVED} from '../actions/orderActions'

const initialState : OrderState = {
	currentOrder:null,
	orderList: null
}

let orderReducer : Reducer<OrderState> = (state : OrderState = initialState, action:Action<any>) => {
	let newState:OrderState = state;
	if(isType(action, GENERAL_ERROR)){
		//
		let error:Error = action.payload;
		newState = (<any>Object).assign({},state,{
			error: error,
		});
	}else if(isType(action, LOAD_ORDER_LIST_RECEIVED)){
		//
		let orderList:DataList<Order> = action.payload;
		newState = (<any>Object).assign({},state,{
			orderList: orderList,
		});
	} 
  return newState;
}

export default orderReducer;