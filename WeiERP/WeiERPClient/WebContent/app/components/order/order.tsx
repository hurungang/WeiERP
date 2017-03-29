import * as React from 'react';
import {State} from '../../reducers/reducerTypes';
import {Link} from 'react-router'
import {Order, DataList,Error} from '../../models/modelTypes'
import Table from '../elements/table'
import EditableSelect from '../elements/editableSelect'
import Invoice from '../order/invoice'
import * as OrderActions from '../../actions/orderActions'

export interface OrderPageProps {
	state: State;
	dispatch: any;
	params: any;
}

export default class OrderPage extends React.Component<OrderPageProps,{}>{
	
  componentWillMount(){
	  let {dispatch,params} = this.props;
	  dispatch(OrderActions.LOAD_ORDER_LIST(params.id));

  }
  
  handleOrderRowClick(rowData){
	  let order:Order = rowData;
	  let {dispatch} = this.props;
	  dispatch(OrderActions.SHOW_ORDER(order));
  }
  
  renderOrderDetail(){
	  let {state} = this.props;
	  let {currentOrder} = state.orderState;
	  if(currentOrder){
		  return(
    			<Invoice order={currentOrder}/>
    	)
	  }
  }
  
  render(){
	  let {state} = this.props;
	  let {orderList,error,isOrderProceeding} = state.orderState;
	  if(isOrderProceeding){
		  return (
				  <div className="col-md-12 col-sm-12 col-xs-12">
				  	<div className="loader">Loading...</div>
				  </div>
		  );
	  }
	  else if(error){
		  return (
				  <div className="col-md-12 col-sm-12 col-xs-12">
				  	<h1>Error: {error.errorCode}</h1>
				  	<h3>{error.errorDetail}</h3>
				  </div>
		  );
	  }else{
		  if(orderList){
		    return (

		    		<div className="row">
		    		  <div className="col-md-12 col-sm-12 col-xs-12">
			            <div className="x_panel">
			              <EditableSelect optionList={[{value:'111'},{value:'111'},{value:'111'},{value:'111'}]} valueName="value" textName="value" name="test"/>
				              
			              <div className="x_title">
			                <h2>Table design <small>Custom design</small></h2>
			                <ul className="nav navbar-right panel_toolbox">
			                  <li><a className="collapse-link"><i className="fa fa-chevron-up"></i></a>
			                  </li>
			                  <li className="dropdown">
			                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i className="fa fa-wrench"></i></a>
			                    <ul className="dropdown-menu" role="menu">
			                      <li><a href="#">Settings 1</a>
			                      </li>
			                      <li><a href="#">Settings 2</a>
			                      </li>
			                    </ul>
			                  </li>
			                  <li><a className="close-link"><i className="fa fa-close"></i></a>
			                  </li>
			                </ul>
			                <div className="clearfix"></div>
			              </div>
			              <div className="x_content">
			
			                <p>Add class <code>bulk_action</code> to table for bulk actions options on row select</p>
			
			                <div className="table-responsive">
			                	<Table dataList={orderList} idColumn="id" clickCallBack={this.handleOrderRowClick.bind(this)}/>
			                </div>
			              </div>
			            </div>
			          </div>
			            {/* show selected order detail(invoice)*/}
				        {this.renderOrderDetail()}
			            {/* show selected order detail(invoice)*/}
			        </div>
		    );
		  }
	  }
	  return null;
}}