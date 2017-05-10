import {Action} from '../actions/actionTypes';
import { User, Order, DataList, Error, Config, Language } from '../models/modelTypes';

export interface Reducer<T> {
  (state: T, action: Action<any>):T
}

export class AppState {
	user: User;
	isSmallMenuMode: boolean;
	error?: Error;
	isAppProceeding: boolean;
  language: Language;
}

export class OrderState {
	currentOrder?: any;
	orderList?: DataList<Order>;
	error?: Error;
	isOrderProceeding: boolean;
}

export class State {
	appState: AppState;
	orderState: OrderState;
}