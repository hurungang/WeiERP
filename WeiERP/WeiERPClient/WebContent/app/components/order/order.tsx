import * as React from 'react';
import {State} from '../../reducers/reducerTypes';
import {Link} from 'react-router'
import {Order, DataList} from '../../models/modelTypes'
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
  
  render(){
	  let {state} = this.props;
	  let {error} = state;
	  let {id} = this.props.params;
	  let orderList:DataList<Order> = {
			  header: {id:"ID",consigneeName:"Consignee Name",consigneeAddress:"Consignee Address"},
			  data:	[
				  {id:1,consigneeName:"Harry",consigneeAddress:"Melbourne"},
				  {id:1,consigneeName:"Tom",consigneeAddress:"Sydney"}]
	  };
	  if(error){
		  return (
				  <div className="col-md-12 col-sm-12 col-xs-12">
				  	<h1>Error: {error.errorCode}</h1>
				  	<h3>{error.errorDetail}</h3>
		  );
	  }else{

		    return (
		    		
		    		<div className="col-md-12 col-sm-12 col-xs-12">
		    			<h1>Order ID:{id}</h1>
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
			                	<Table dataList={orderList}/>
			                </div>
			              </div>
			            </div>	
			          </div>
		    );
	  }
}}