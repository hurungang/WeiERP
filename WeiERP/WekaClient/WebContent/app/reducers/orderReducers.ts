import {Reducer,OrderState} from './reducerTypes';
import {Action,
	isType
	} from '../actions/actionTypes';
import { Order, DataList, Error, Success } from '../models/modelTypes';
import {
	LOAD_ORDER_LIST_RECEIVED,
	ORDER_PROCEEDING,
	ORDER_PROCEEDING_END,
	SHOW_ORDER,
	SHOW_ORDER_BY_ID,
	CLOSE_CURRENT_ORDER,
	SAVE_ORDER_RECEIVED,
    ADD_ORDER,
} from '../actions/orderActions'
import { GENERAL_ERROR, GENERAL_SUCCESS } from "../actions/appActions";

export const INITIAL_ORDER_STATE : OrderState = {
	currentOrder:null,
	orderList: null,
	isOrderProceeding: false,
}

let orderReducer : Reducer<OrderState> = (state : OrderState = INITIAL_ORDER_STATE, action:Action<any>) => {
	let newState:OrderState = Object.assign({},state,{
			alerts: [],
		});
	if(isType(action, GENERAL_ERROR)){
		//
		let {alerts} = newState;
		let error:Error = action.payload;
		alerts.push(error);
		newState = Object.assign({},state,{
			alerts: alerts,
		});
	}else if(isType(action, GENERAL_SUCCESS)){
		//
		let {alerts} = newState;
		let success:Success = new Success();
		success.successCode = action.payload;
		alerts.push(success);
		newState = Object.assign({},state,{
			alerts: alerts,
		});
	}else if(isType(action, LOAD_ORDER_LIST_RECEIVED)){
		//
		let orderList:DataList<Order> = action.payload;
		newState = Object.assign({},state,{
			orderList: orderList,
		});
	}else if(isType(action, ORDER_PROCEEDING)){
		newState = Object.assign({},state,{
			isOrderProceeding: true,
		});
	}else if(isType(action, ORDER_PROCEEDING_END)){
		newState = Object.assign({},state,{
			isOrderProceeding: false,
		});
	}else if(isType(action, SHOW_ORDER)){
		let currentOrder:Order = action.payload;
		newState = Object.assign({},state,{
			currentOrder: currentOrder,
		});
	}else if(isType(action, SHOW_ORDER_BY_ID)){
    let orderList:DataList<Order> = state.orderList;
		let id:string = action.payload;
		if(orderList.data&&orderList.data.length>1){
			let currentOrder:Order = orderList.data.find(element=>element.id==id);
			newState = Object.assign({},state,{
				currentOrder: currentOrder,
			});
		}
	}else if(isType(action, CLOSE_CURRENT_ORDER)){
		newState = Object.assign({},state,{
			currentOrder: null,
		});

	}else if(isType(action, SAVE_ORDER_RECEIVED)){
		let savedOrder:Order = action.payload;
		let orderList = newState.orderList;
		orderList.addOrReplace(savedOrder);
		newState = Object.assign({},state,{
			//currentOrder: null,
		});
	}else if(isType(action, ADD_ORDER)){
		let order = new Order();
		newState = Object.assign({},state,{
			currentOrder: new Order(),
		});
	}
  return newState;
}

export default orderReducer;