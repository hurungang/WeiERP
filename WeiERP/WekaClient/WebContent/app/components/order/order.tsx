import * as React from 'react';
import { State } from '../../reducers/reducerTypes';
import { Order, Error, TableAction, BulkActionPayload, Success } from '../../models/modelTypes';
import Invoice from '../order/invoice';
import * as OrderActions from '../../actions/orderActions';
import Alert from "../elements/alert";
import OrderList from "./orderList";
import { StatusCode } from "WekaServer/model/enums";

export interface OrderPageProps {
	state: State;
	dispatch: any;
	params: any;
}


export default class OrderPage extends React.Component<OrderPageProps, {}>{
	constructor() {
		super();
	}
	componentWillMount() {
		let { dispatch, params,state } = this.props;
		let {token} = state.appState;
		dispatch(OrderActions.LOAD_ORDER_LIST(params.id,token));

	}

	handleOrderRowClick(rowData: Order) {
		let order: Order = rowData;
		let { dispatch } = this.props;
		dispatch(OrderActions.SHOW_ORDER(order));
	}

	handleInvoiceCloseClick() {
		let { dispatch } = this.props;
		dispatch(OrderActions.CLOSE_CURRENT_ORDER());
	}

	handleOrderSave(updatedOrder: Order) {
		let { dispatch,state } = this.props;
		let {token} = state.appState;
		dispatch(OrderActions.SAVE_ORDER(updatedOrder,token));
	}

	handleCreateAction() {
		let { dispatch } = this.props;
		dispatch(OrderActions.ADD_ORDER());
	}

	handleBulkUpdateAction(applyChange:{},selectedItem:any[]) {
		let { dispatch, state } = this.props;
		let {token} = state.appState;
		let idList:string[] = selectedItem.map((item)=>{
			if(item.selected){
				return item.id;
			}
		})
		let payload:BulkActionPayload = {idList:idList,applyChange:applyChange}
		dispatch(OrderActions.BULK_CHANGE_ORDERS(payload,token));
	}
	handleBulkSendAction(selectedItem:any[]) {
		console.log("bulk send");
	}

	render() {
		let { state, dispatch } = this.props;
		let { orderList, alerts, isOrderProceeding, currentOrder } = state.orderState;
		let {user,language} = state.appState;
		let textPac = language.textPackage;
		const tableActions:TableAction = {
			bulkActions: [{
				[textPac.order.bulkDelete]:this.handleBulkUpdateAction.bind(this,{isDeleted:true}),
				},{
				[textPac.order.bulkChangeStatus]:null,
				[textPac.order.changeStatusButtons[StatusCode[StatusCode.Created]]]:this.handleBulkUpdateAction.bind(this,{status:StatusCode[StatusCode.Created]}),
				[textPac.order.changeStatusButtons[StatusCode[StatusCode.Paid]]]:this.handleBulkUpdateAction.bind(this,{status:StatusCode[StatusCode.Paid]}),
				[textPac.order.changeStatusButtons[StatusCode[StatusCode.Printed]]]:this.handleBulkUpdateAction.bind(this,{status:StatusCode[StatusCode.Printed]}),
				[textPac.order.changeStatusButtons[StatusCode[StatusCode.Sent]]]:this.handleBulkUpdateAction.bind(this,{status:StatusCode[StatusCode.Sent]}),

			},
			{
				[textPac.order.bulkSend]:null,
				[textPac.order.sendButtons.newBatch]:this.handleBulkSendAction.bind(this),
			}],
			createAction:this.handleCreateAction.bind(this),
		}
		if (isOrderProceeding) {
			return (
				<div className="col-xs-12">
					<div className="loader">Loading...</div>
				</div>
			);
		}
		else {
					return (
						<div className="row">
							{alerts.map((alert)=>{
								if(alert instanceof Error){
									return <Alert summary={textPac.errorMessage[alert.errorCode]} detail={textPac.errorMessage[alert.serverErrorCode]} type="error"/>
								}
								if(alert instanceof Success){
									return <Alert summary={textPac.errorMessage[alert.successCode]} type="success"/>
								}
							})}
							{orderList&&!currentOrder?<OrderList orderList={orderList} onOrderRowClick={this.handleOrderRowClick.bind(this)} language={language} actions={tableActions}/>:""}
							{currentOrder?< Invoice order={currentOrder} state={state} dispatch={dispatch} user={user} onClose={this.handleInvoiceCloseClick.bind(this)} onSave={this.handleOrderSave.bind(this, currentOrder)} language={language} />:""}
							{/* show selected order detail(invoice)*/}
						</div>
					);
		}
	}
}