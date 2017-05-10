import * as React from 'react';
import { State } from '../../reducers/reducerTypes';
import { Link } from 'react-router';
import { Order, DataList, Error, Paginator } from '../../models/modelTypes';
import Table from '../elements/table';
import EditableSelect from '../elements/editableSelect';
import Invoice from '../order/invoice';
import * as OrderActions from '../../actions/orderActions';
import * as DatetimeRangePicker from 'react-bootstrap-datetimerangepicker';
import * as moment from 'moment';
import * as dateFormater from 'dateformat'
import XTitle from "../layout/xtitle";
import InputGroup from "../layout/inputGroup";
import LabeledSelect from "../layout/LabeledSelect";

export interface OrderPageProps {
	state: State;
	dispatch: any;
	params: any;
}
interface OrderPageState {
	keyword: string;
	paginator: Paginator;
	sortBy: string,
	sortDesc: boolean,
	ranges: any,
	startDate: moment.Moment,
	endDate: moment.Moment,
	orderStatus: string,
}

export default class OrderPage extends React.Component<OrderPageProps, OrderPageState>{

	constructor() {
		super();
		this.state = {
			keyword: "",
			paginator: new Paginator(1, 10),
			sortBy: "createTime",
			sortDesc: true,
			startDate: moment().subtract(29, 'days'),
			endDate: moment(),
			ranges: {
				'Today': [moment(), moment()],
				'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
				'Last 7 Days': [moment().subtract(6, 'days'), moment()],
				'Last 30 Days': [moment().subtract(29, 'days'), moment()],
				'This Month': [moment().startOf('month'), moment().endOf('month')],
				'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
			},
			orderStatus: null,
		};
	}
	componentWillMount() {
		let { dispatch, params } = this.props;
		dispatch(OrderActions.LOAD_ORDER_LIST(params.id));

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
		let { dispatch } = this.props;
		dispatch(OrderActions.SAVE_ORDER(updatedOrder));
	}
	handleKeywordChange(event: any) {
		let keyword = event.target.value;
		let newState = { ...this.state, keyword: keyword }
		console.log(newState);
		this.setState(newState);
	}

	handlePageChange(currentPage: number) {
		let { paginator } = this.state;
		paginator.currentPage = currentPage ? currentPage : 1;
		let newState = { ...this.state, paginator: paginator }
		this.setState(newState);
	}

	handleShowEntriesChange(event: any) {
		let entriesPerPage = event.target.value;
		let { paginator } = this.state;
		paginator.entriesPerPage = entriesPerPage ? parseInt(entriesPerPage) : 1;
		let newState = { ...this.state, paginator: paginator };
		this.setState(newState);
	}

	handleFilterOrderStatusChange(event: any) {
		let orderStatus = event.target.value;
		let newState = { ...this.state, orderStatus: orderStatus };
		this.setState(newState);
	}

	handleDateRangeChange(event, picker) {
		console.log(picker.startDate);
		let newState = {
			...this.state,
			startDate: picker.startDate,
			endDate: picker.endDate
		};
		this.setState(newState);
	}

	render() {
		let { state } = this.props;
		let { orderList, error, isOrderProceeding, currentOrder } = state.orderState;
		let language = state.appState.language;
		let textPac = language.textPackage;
		let { paginator, startDate, endDate, orderStatus } = this.state;
		let selectedDateRangeString: string = startDate && endDate ? `${dateFormater(startDate, language.timeFormat)} - ${dateFormater(endDate, language.timeFormat)}` : "";
		if (isOrderProceeding) {
			return (
				<div className="col-md-12 col-md-12 col-xs-12">
					<div className="loader">Loading...</div>
				</div>
			);
		}
		else if (error) {
			return (
				<div className="col-md-12 col-md-12 col-xs-12">
					<h1>Error: {error.errorCode}</h1>
					<h3>{error.errorDetail}</h3>
				</div>
			);
		} else {
			if (orderList) {
				orderList.sort(this.state.sortBy, this.state.sortDesc);

				let filterOrderList = orderList ? orderList.filter(this.state.keyword) : null;
				filterOrderList = filterOrderList.filter((order) => {
					return ((!orderStatus||order.status === orderStatus) && startDate.isSameOrBefore(order.createTime) && endDate.isSameOrAfter(order.createTime));
				})
				paginator.init(filterOrderList);
				if (currentOrder == null) {
					return (

						<div className="row">

							<div className="col-xs-12">
								<div className="x_panel">
									<XTitle title={textPac.orderListTitle} smallTitle={orderStatus} />
									<div className="x_content">
										<div className="well row form-horizontal form-label-left">
											<DatetimeRangePicker
												timePicker
												timePicker24Hour
												showDropdowns
												timePickerSeconds = {false} 
												locale={textPac.timeRangePicker}
												startDate={startDate}
												endDate={endDate}
												onApply={this.handleDateRangeChange.bind(this)}
												className="col-xs-6"
											>
												<InputGroup iconClass="fa fa-calendar" defaultValue={selectedDateRangeString}/>
											</DatetimeRangePicker>
											<LabeledSelect 
												containerClass="col-xs-6" labelClass="col-xs-4" selectContainerClass="col-xs-8" 
												label={textPac.order.status} 
												onChange={this.handleFilterOrderStatusChange.bind(this)}
												options={[{name:"Created",value:"Created"},{name:"Paid",value:"Paid"}]}/>
										</div>
										<div id="datatable-responsive_wrapper" className="dataTables_wrapper form-inline dt-bootstrap no-footer">
											<div className="row">
												<div className="col-xs-8"><div className="dataTables_length">
													<label>Show <select name="datatable-responsive_length" aria-controls="datatable-responsive" className="form-control input-sm" onChange={this.handleShowEntriesChange.bind(this)}><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option></select> entries</label></div></div>
												<div className="col-xs-4">
													<InputGroup iconClass="fa fa-search" containerClass="col-xs-12" onChange={this.handleKeywordChange.bind(this)}/>
												</div>
											</div>
											<div className="row">
												<div className="col-xs-12">
													<Table list={paginator.slice} header={{ id: textPac.order.id, consigneeName: textPac.order.consigneeName, consigneeAddress: textPac.order.consigneeAddress, consigneePhone: textPac.order.consigneePhone, status: textPac.order.status, createTime: textPac.order.createTime, }} idColumn="id" clickCallBack={this.handleOrderRowClick.bind(this)} dateFormat={language.timeFormat} />
												</div>
											</div>
											<div className="row">
												<div className="col-xs-5">
													<div className="dataTables_info" id="datatable-fixed-header_info" role="status" aria-live="polite">
														Showing {paginator.start} to {paginator.end} of {paginator.totalRecords} entries
													</div>
												</div>
												<div className="col-xs-7">
													<div className="dataTables_paginate paging_simple_numbers" id="datatable-fixed-header_paginate">
														<ul className="pagination">
															<li className="paginate_button previous disabled" id="datatable-fixed-header_previous">
																<a aria-controls="datatable-fixed-header" data-dt-idx="0" onClick={paginator.currentPage > 1 ? this.handlePageChange.bind(this, paginator.currentPage + 1) : null}>Previous</a></li>
															{paginator.map((page) => {
																return <li key={page} className={paginator.currentPage == page ? 'paginate_button active' : 'paginate_button'}><a aria-controls="datatable-fixed-header" onClick={this.handlePageChange.bind(this, page)} data-dt-idx="{index}">{page}</a></li>
															})}
															<li className="paginate_button next" id="datatable-fixed-header_next"><a aria-controls="datatable-fixed-header" onClick={this.handlePageChange.bind(this, paginator.currentPage + 1)}>Next</a></li>
														</ul>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					);
				} else {
					return (

						<div className="row">
							{/* show selected order detail(invoice)*/}
							< Invoice order={currentOrder} onClose={this.handleInvoiceCloseClick.bind(this)} onSave={this.handleOrderSave.bind(this, currentOrder)} language={language} />
							{/* show selected order detail(invoice)*/}
						</div>
					);
				}
			}
		}
		return null;
	}
}