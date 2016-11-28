import {Reducer,OrderState} from './reducerTypes';
import {Action,
	isType
	} from '../actions/actionTypes';
import {Order,DataList,Error} from '../models/modelTypes';
import {
	GENERAL_ERROR, 
	LOAD_ORDER_LIST_RECEIVED,
	ORDER_PROCEEDING,
	ORDER_PROCEEDING_END
} from '../actions/orderActions'

const initialState : OrderState = {
	currentOrder:null,
	orderList: null,
	isOrderProceeding: false,
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
	}else if(isType(action, ORDER_PROCEEDING)){
		newState = (<any>Object).assign({},state,{
			isOrderProceeding: true,
		});
	}else if(isType(action, ORDER_PROCEEDING_END)){
		newState = (<any>Object).assign({},state,{
			isOrderProceeding: false,
		});
	}
  return newState;
}

export default orderReducer;