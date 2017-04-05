import orderReducers from '../../app/reducers/orderReducers'
import {INITIAL_ORDER_STATE} from '../../app/reducers/orderReducers'
import {
  GENERAL_ERROR, 
  LOAD_ORDER_LIST_RECEIVED,
  ORDER_PROCEEDING,
  ORDER_PROCEEDING_END,
  SHOW_ORDER,
  SHOW_ORDER_BY_ID,
  ADD_ORDER,
} from '../../app/actions/orderActions'
import {OrderState} from '../../app/reducers/reducerTypes';
import {Error,DataList,Order} from '../../app/models/modelTypes';
import * as chai from 'chai'
import * as mocha from 'mocha'


describe("App Reducers",()=>{

  it("GENERAL_ERROR",()=>{
    let error:Error = new Error();
    error.errorCode = "test";
    let newState:OrderState = orderReducers(INITIAL_ORDER_STATE,GENERAL_ERROR(error));
    chai.assert.strictEqual(newState.error,error);
  })
  
  it("LOAD_ORDER_LIST_RECEIVED",()=>{
    let orderList:DataList<Order> = {header:null,data:[new Order()]};
    let newState:OrderState = orderReducers(INITIAL_ORDER_STATE,LOAD_ORDER_LIST_RECEIVED(orderList));
    chai.assert.strictEqual(newState.orderList,orderList);
  })
  
  it("ORDER_PROCEEDING",()=>{
    chai.assert.strictEqual(INITIAL_ORDER_STATE.isOrderProceeding,false);
    let newState:OrderState = orderReducers(INITIAL_ORDER_STATE,ORDER_PROCEEDING());
    chai.assert.strictEqual(newState.isOrderProceeding,true);
    newState = orderReducers(INITIAL_ORDER_STATE,ORDER_PROCEEDING_END());
    chai.assert.strictEqual(newState.isOrderProceeding,false);
  })
  
  it("SHOW_ORDER",()=>{
    let order:Order = new Order();
    order.id = 1;
    let newState:OrderState = orderReducers(INITIAL_ORDER_STATE,SHOW_ORDER(order));
    chai.assert.strictEqual(newState.currentOrder,order);
  })
  
  it("SHOW_ORDER_BY_ID",()=>{
    let order:Order = new Order();
    order.id = 1;
    let orderList:DataList<Order> = {header:null,data:[order,new Order()]};
    let newState:OrderState = orderReducers(INITIAL_ORDER_STATE,LOAD_ORDER_LIST_RECEIVED(orderList));
    newState = orderReducers(newState,SHOW_ORDER_BY_ID(1));
    chai.assert.strictEqual(newState.currentOrder,order);
  })
  
  it("ADD_ORDER",()=>{
    let order:Order = new Order();
    order.id = 1;
    let newState:OrderState = orderReducers(INITIAL_ORDER_STATE,ADD_ORDER(order));
    //todo
  })
})
