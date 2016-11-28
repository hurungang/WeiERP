import {Action} from '../actions/actionTypes';
import {User,Order,DataList,Error} from '../models/modelTypes';

export interface Reducer<T> {
  (state: T, action: Action<any>):T
}

export interface AppState {
	user: User;
	isSmallMenuMode: boolean;
	error?: Error;
	isAppProceeding: boolean;
}

export interface OrderState {
	currentOrder?: any;
	orderList?: DataList<Order>;
	error?: Error;
	isOrderProceeding: boolean;
}

export interface State {
	appState: AppState;
	orderState: OrderState;
}