import {Action} from '../actions/actionTypes';
import {User,Order,DataList,Error,Localization} from '../models/modelTypes';

export interface Reducer<T> {
  (state: T, action: Action<any>):T
}

export class AppState {
	user: User;
	isSmallMenuMode: boolean;
	error?: Error;
	isAppProceeding: boolean;
  config : Object;
  language: string;

  constructor(){
  }
  
  getText= function():Localization{
    if(this.config&&this.language){
      return this.config.localization[this.language];
    }else{
      return null;
    }
  }
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