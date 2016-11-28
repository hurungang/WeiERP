import {Action} from '../actions/actionTypes';
import {User,Order,DataList} from '../models/modelTypes';

export interface Reducer<T> {
  (state: T, action: Action<any>):T
}

export interface AppState {
	user: User;
	isSmallMenuMode: boolean;
}

export interface OrderState {
	currentOrder: any;
	orderList: DataList<Order>;
}

export interface State {
	appState: AppState;
	orderState: OrderState;
}