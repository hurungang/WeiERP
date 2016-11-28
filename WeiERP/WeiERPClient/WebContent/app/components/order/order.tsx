import * as React from 'react';
import {State} from '../../reducers/reducerTypes';
import {Link} from 'react-router'
import {Order, DataList,Error} from '../../models/modelTypes'
import Table from '../elements/table'
import * as OrderActions from '../../actions/orderActions'

export interface OrderProps {
	state: State;
	dispatch: any;
	params: any;
}

export default class OrderPage extends React.Component<OrderProps,{}>{
	
  componentWillMount(){
	  let {dispatch} = this.props;
	  dispatch(OrderActions.LOAD_ORDER_LIST());
  }
  
  handleOrderRowClick(event){
	  let order:Order = event.currentTarget.dataset.row;
	  let {dispatch} = this.props;
	  dispatch(OrderActions.SHOW_ORDER(order));
  }
  
  render(){
	  let {state} = this.props;
	  let {currentOrder,orderList,error,isOrderProceeding} = state.orderState;
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
		    		
		    		<div className="col-md-12 col-sm-12 col-xs-12">
		    			<h1>Order ID:{currentOrder.id}</h1>
			            <div className="x_panel">
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
			                	<Table dataList={orderList} idColumn="id" showLink={true} clickCallBack={this.handleOrderRowClick}/>
			                </div>
			              </div>
			            </div>	
			          </div>
		    );
		  }
		  if(currentOrder){
			  return(
	    		<div className="col-md-12 col-sm-12 col-xs-12">
	    			<h1>Order ID:{currentOrder.id}</h1>
	    		</div>
	    	)
		  }
	  }
	  return null;
}}