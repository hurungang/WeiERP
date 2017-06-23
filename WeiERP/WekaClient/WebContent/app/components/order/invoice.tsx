import * as React from 'react';
import * as dateFormater from 'dateformat'
import { Order, OrderItem, Language, Product, User, TableAction, Consignee } from '../../models/modelTypes'
import EditableSelect from "../elements/editableSelect";
import DataUtils from "../../utils/dataUtils";
import * as OrderActions from '../../actions/orderActions';

interface InvoiceProps {
  order: Order;
  onClose: any;
  onSave: any;
  language: Language;
  user: User;
  dispatch: any;
}
interface InvoiceState {
  formValidationMap: Map<any, boolean>;
  selectedOrderItems: OrderItem[];
}
export default class Invoice extends React.Component<InvoiceProps, InvoiceState>{
  refs: {
    senderName: HTMLInputElement;
    senderPhone: HTMLInputElement;
    senderAddress: HTMLInputElement;
    consigneeName: EditableSelect;
    consigneePhone: EditableSelect;
    consigneeAddress: EditableSelect;
    agentName: EditableSelect;
    comments: HTMLInputElement;
    tax: HTMLInputElement;
    shipping: HTMLInputElement;
    paid: HTMLInputElement;
  }
  constructor() {
    super();
    this.state = { formValidationMap: new Map<any, boolean>(),selectedOrderItems:[] };
  }
  handleOrderChange() {
    let { order } = this.props;
    order.senderName = this.refs.senderName.value;
    order.senderPhone = this.refs.senderPhone.value;
    order.senderAddress = this.refs.senderAddress.value;
    order.consigneeName = this.refs.consigneeName.value;
    order.consigneePhone = this.refs.consigneePhone.value;
    order.consigneeAddress = this.refs.consigneeAddress.value;
    order.comments = this.refs.comments.value;
    let newPaid = parseFloat(this.refs.paid.value);
    order.paid = newPaid != NaN ? newPaid : order.paid;
    let newShipping = parseFloat(this.refs.shipping.value);
    order.shipping = newShipping != NaN ? newShipping : order.shipping;
    let newTax = parseFloat(this.refs.tax.value);
    order.tax = newTax != NaN ? newTax : order.tax;
    this.forceUpdate();
  }

  handleConsigneeChange() {
    let { order } = this.props;
    let data = this.refs.consigneeName.data;
    if (!data) {
      data = this.refs.consigneePhone.data;
    }
    if (!data) {
      this.refs.consigneeAddress.data;
    }

    if (data) {
      order.consigneeName = data.consigneeName;
      order.consigneePhone = data.consigneePhone;
      order.consigneeAddress = data.consigneeAddress;
      this.refs.consigneeName.remount();
      this.refs.consigneePhone.remount();
      this.refs.consigneeAddress.remount();
    } else {
      order.consigneeName = this.refs.consigneeName.value;
      order.consigneePhone = this.refs.consigneePhone.value;
      order.consigneeAddress = this.refs.consigneeAddress.value;
    }
    this.forceUpdate();
  }

  
  handleAgentChange() {
    let { order } = this.props;
    let data = this.refs.agentName.data;
    
    if (data) {
      order.agent = data.consigneeName;
      this.refs.agentName.remount();
    }else{
      order.agent = this.refs.agentName.value;
    }
    this.forceUpdate();
  }

  handleOrderQuantityChange(orderItem: OrderItem, event: any) {
    let newQuantity = parseInt(event.target.value);
    orderItem.productQuantity = newQuantity != NaN ? newQuantity : orderItem.productQuantity;
    this.forceUpdate();

  }

  handleOrderProductPriceChange(orderItem: OrderItem, event: any) {
    let newPrice = parseFloat(event.target.value);
    orderItem.productOrderPrice = newPrice != NaN ? newPrice : orderItem.productOrderPrice;
    this.forceUpdate();
  }

  handleAddOrderItem() {
    let { order } = this.props;
    let tempOrderItem = new OrderItem();
    tempOrderItem.productQuantity = 1;
    order.orderItems.push(tempOrderItem);
    this.forceUpdate();
  }

  handleProductNameChange(orderItem: OrderItem, event: any) {
    let { user } = this.props;
    let productName = event.target.value;
    if (productName == null || productName.trim() == "") {
      event.target.className = event.target.className + " bad";
      this.state.formValidationMap.set(event.target, false);
    } else {
      event.target.className.replace("bad", "");
      this.state.formValidationMap.delete(event.target);
      orderItem.product = user.products.find((product) => product.productName == productName);
      if (!orderItem.product) {
        orderItem.product = new Product();
        orderItem.product.productName = productName;
      }
    }
    this.forceUpdate();
  }

  handleOrderItemChange() {
    let { order } = this.props;
    let selectedOrderItems = order.orderItems.filter((item:any) => item.selected);
    let newState = { ...this.state, selectedOrderItems: selectedOrderItems };
    this.setState(newState);
  }

  handleBulkDeleteAction() {
    let { order } = this.props;
    order.orderItems = order.orderItems.filter((item:any)=>!item.selected);
    this.forceUpdate();
  }
  
  handleBulkSplitAction() {
    let {selectedOrderItems} = this.state;
    let {dispatch,order} = this.props;
    //dispatch(OrderActions.SPLIT_ORDER(order,selectedOrderItems))
  }

  handleSelectAll(event:any){
		let {order} = this.props;
		order.orderItems.map((item: any)=>item.selected=event.target.checked);
		this.handleOrderItemChange();
	}
  
  handleSelected(orderItem: any,event: any){
		orderItem.selected = event.target.checked;
		this.handleOrderItemChange();
	}

  render() {
    let { order, onClose, onSave, language, user } = this.props;
    let {selectedOrderItems} = this.state;
    let textPac = language.textPackage;
    let orderCreateTime = order.createTime ? dateFormater(order.createTime, language.timeFormat) : "";
    let orderPaidTime = order.paidTime ? dateFormater(order.paidTime, language.timeFormat) : "";
    let paid = order.paid ? order.paid : 0;
    let tax = order.tax ? order.tax : 0;
    let shipping = order.shipping ? order.shipping : 0;

    let consigneeAddresses = DataUtils.buildConsigneeAddressList(user.consignees);
    let agentList = consigneeAddresses.filter((consignee)=>consignee.isAgent);
    // consigneeAddresses = consigneeAddresses.filter((address)=>{
    //   return (!order.consigneeName||address.addressString.includes(order.consigneeName))&&
    //   (!order.consigneePhone||address.addressString.includes(order.consigneePhone))
    // })
    
	  let checkAll = order.orderItems.find((item:any)=>!item.selected)?false:true;

    const orderItemActions: TableAction = {
      bulkActions: [{
        [textPac.orderItem.bulkAction]: null,
        [textPac.orderItem.bulkSplit]: this.handleBulkSplitAction.bind(this),
        [textPac.orderItem.bulkDelete]: this.handleBulkDeleteAction.bind(this),
      }],
      createAction: this.handleAddOrderItem.bind(this),
    }

    if (user) {
      order.senderName = order.senderName ? order.senderName : user.sender ? user.sender : user.name ? user.name : "";
      order.senderAddress = order.senderAddress ? order.senderAddress : user.address ? user.address : "";
      order.senderPhone = order.senderPhone ? order.senderPhone : user.phone ? user.phone : "";
    }
    return (
      <div className="col-md-12 col-sm-12 col-xs-12">
        <div className="x_panel">
          <div className="x_title">
            <h2>{language.textPackage.order.id}:{order.id}<small></small></h2>
            <ul className="nav navbar-right panel_toolbox">
              <li><a className="collapse-link"><i className="fa fa-chevron-up"></i></a>
              </li>
              <li><a className="close-link" onClick={onClose}><i className="fa fa-close"></i></a>
              </li>
            </ul>
            <div className="clearfix"></div>
          </div>
          <div className="x_content">

            <section className="content invoice">
              {/*<!-- title row -->*/}
              <div className="row">
                <div className="col-xs-12 invoice-header">
                  <h1>
                    <i className="fa fa-globe"></i> {language.textPackage.invoiceTitle}
                    <small className="pull-right">{language.textPackage.currencyInfo}</small>
                  </h1>
                </div>
                {/*<!-- /.col -->*/}
              </div>
              {/*<!-- info row -->*/}
              <div className="row invoice-info">
                <div className="col-sm-6 invoice-col">
                  <p className="lead">{language.textPackage.order.senderName}</p>
                  <div className="col-md-12 col-sm-12 col-xs-12 form-group has-feedback">
                    <input type="text" onChange={this.handleOrderChange.bind(this)} className="form-control has-feedback-left" placeholder={order.senderName} ref="senderName" defaultValue={order.senderName} />
                    <span className="fa fa-user form-control-feedback left" aria-hidden="true"></span>
                  </div>
                  <div className="col-md-12 col-sm-12 col-xs-12 form-group has-feedback">
                    <input type="text" onChange={this.handleOrderChange.bind(this)} className="form-control has-feedback-left" placeholder={order.senderPhone} ref="senderPhone" defaultValue={order.senderPhone} />
                    <span className="fa fa-phone form-control-feedback left" aria-hidden="true"></span>
                  </div>
                  <div className="col-md-12 col-sm-12 col-xs-12 form-group has-feedback">
                    <input type="text" onChange={this.handleOrderChange.bind(this)} className="form-control has-feedback-left" placeholder={order.senderAddress} ref="senderAddress" defaultValue={order.senderAddress} />
                    <span className="fa fa-home form-control-feedback left" aria-hidden="true"></span>
                  </div>
                </div>
                {/*<!-- /.col -->*/}
                <div className="col-sm-6 invoice-col">
                  <p className="lead">{language.textPackage.order.consigneeName}</p>
                  <div className="col-md-12 col-sm-12 col-xs-12 form-group has-feedback">
                    <EditableSelect ref="consigneeName" onChange={this.handleConsigneeChange.bind(this)} optionList={consigneeAddresses} textName="consigneeName" valueName="addressString" className="form-control has-feedback-left" defaultValue={order.consigneeName} />
                    <span className="fa fa-user form-control-feedback left" aria-hidden="true"></span>
                  </div>
                  <div className="col-md-12 col-sm-12 col-xs-12 form-group has-feedback">
                    <EditableSelect ref="consigneePhone" onChange={this.handleConsigneeChange.bind(this)} optionList={consigneeAddresses} textName="consigneePhone" valueName="addressString" className="form-control has-feedback-left" defaultValue={order.consigneePhone} />
                    <span className="fa fa-phone form-control-feedback left" aria-hidden="true"></span>
                  </div>
                  <div className="col-md-12 col-sm-12 col-xs-12 form-group has-feedback">
                    <EditableSelect ref="consigneeAddress" onChange={this.handleConsigneeChange.bind(this)} optionList={consigneeAddresses} textName="consigneeAddress" valueName="addressString" className="form-control has-feedback-left" defaultValue={order.consigneeAddress} />
                    <span className="fa fa-home form-control-feedback left" aria-hidden="true"></span>
                  </div>
                </div>
                <div className="col-sm-6 invoice-col">
                  <p className="lead">{language.textPackage.order.agent}</p>
                  <div className="col-md-12 col-sm-12 col-xs-12 form-group has-feedback">
                    <EditableSelect ref="agentName" onChange={this.handleAgentChange.bind(this)} optionList={agentList} textName="consigneeName" valueName="addressString" className="form-control has-feedback-left" defaultValue={order.agent} />
                    <span className="fa fa-user form-control-feedback left" aria-hidden="true"></span>
                  </div>
                </div>
              </div>
              {/*<!-- /.row -->*/}

              {/*<!-- Table row -->*/}
              <div className="row">
                <div className="col-xs-12 table">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th><div className="icheckbox_flat-green"><input type="checkbox" checked={checkAll} className="flat" onChange={this.handleSelectAll.bind(this)} /></div></th>
                        <th>{language.textPackage.orderItem.productQuantity}</th>
                        <th>{language.textPackage.orderItem.product}</th>
                        <th>{language.textPackage.product.productPrice}</th>
                        <th>{language.textPackage.orderItem.productOrderPrice}</th>
                        <th>{language.textPackage.orderItem.subtotal}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems.map((orderItem, index) => {
                        let productPrice = orderItem.product && orderItem.product.productPrice ? orderItem.product.productPrice : 0.0;
                        let productOrderPrice = orderItem.productOrderPrice ? orderItem.productOrderPrice : productPrice;
                        let productQuantity = orderItem.productQuantity ? orderItem.productQuantity : 0;
                        let orderItemSubtotal = productOrderPrice * productQuantity;
                        return (
                          <tr key={`tr_${orderItem.id}`}>
                            <td className="a-center ">
                              <div className="icheckbox_flat-green"><input type="checkbox" className="flat" checked={(orderItem as any).selected ? true : false} onChange={this.handleSelected.bind(this,orderItem)} /></div>
                            </td>
                            <td>
                              <input type="text" onChange={this.handleOrderQuantityChange.bind(this, orderItem)} placeholder={productQuantity.toFixed(0)} className="form-control" defaultValue={productQuantity.toFixed(0)} />
                            </td>
                            <td><EditableSelect onChange={this.handleProductNameChange.bind(this, orderItem)} optionList={user.products} textName="productName" valueName="productName" className="form-control" name={`oi_${index}_product`} defaultValue={orderItem.product ? orderItem.product.productName : ""} /></td>
                            <td>{productPrice}</td>
                            <td>
                              <input type="text" onChange={this.handleOrderProductPriceChange.bind(this, orderItem)} placeholder={productOrderPrice.toFixed(2)} className="form-control" defaultValue={productOrderPrice.toFixed(2)} />
                            </td>
                            <td>
                              {orderItemSubtotal.toFixed(2)}
                            </td>
                          </tr>
                        )
                      })}
                      <tr>
                        <td colSpan={5}>

                          <div className="col-xs-12 no-print">

                            {
                              (orderItemActions && selectedOrderItems && selectedOrderItems.length > 0) ?
                                //when some rows selected
                                <div className="btn-group">
                                  <button type="button" className="btn btn-success">
                                    <i className="fa fa-cubes"></i> {language.textPackage.button.bulkAction}</button>
                                  <button type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                    <span className="caret"></span>
                                  </button>
                                  <ul className="dropdown-menu" role="menu">
                                    {
                                      orderItemActions.bulkActions.map((bulkActionGroup, index) => {
                                        return Object.keys(bulkActionGroup).map((key, index2) => {
                                          if (!bulkActionGroup[key]) {
                                            return <li key={index + "_" + index2} className="text-divider">{key}</li>
                                          } else {
                                            return <li key={index + "_" + index2}><a onClick={bulkActionGroup[key].bind(this, selectedOrderItems)}>{key}</a></li>

                                          }
                                        })
                                      })
                                    }
                                  </ul>
                                </div>
                                :
                                //when now rows selected
                                <button type="button" className="btn btn-success" onClick={orderItemActions.createAction.bind(this)}>
                                  <i className="fa fa-plus"></i> {language.textPackage.button.create}</button>
                            }
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/*<!-- /.col -->*/}
              </div>
              {/*<!-- /.row -->*/}

              <div className="row">
                {/*<!-- accepted payments column -->*/}
                <div className="col-xs-6">
                  <p className="lead">{language.textPackage.order.rawMessage}</p>
                  <p className="text-muted well well-sm no-shadow">
                    {order.rawMessage}
                  </p>
                  <label htmlFor="comments">{language.textPackage.order.comments}</label>
                  <textarea className="form-control" onChange={this.handleOrderChange.bind(this)} ref="comments" defaultValue={order.comments}></textarea>
                </div>
                {/*<!-- /.col -->*/}
                <div className="col-xs-6">
                  <p className="lead">{language.textPackage.order.createTime}: {orderCreateTime}</p>
                  <div className="table-responsive">
                    <table className="table">
                      <tbody>
                        <tr>
                          <th>{language.textPackage.order.subtotal}</th>
                          <td>{order.getSubtotal()}</td>
                        </tr>
                        <tr>
                          <th>{language.textPackage.order.tax}</th>
                          <td>
                            <input onChange={this.handleOrderChange.bind(this)} type="text" placeholder={tax.toFixed(2)} className="form-control" ref="tax" defaultValue={tax.toFixed(2)} />
                          </td>
                        </tr>
                        <tr>
                          <th>{language.textPackage.order.shipping}</th>
                          <td>
                            <input onChange={this.handleOrderChange.bind(this)} type="text" placeholder={shipping.toFixed(2)} className="form-control" ref="shipping" defaultValue={shipping.toFixed(2)} />
                          </td>
                        </tr>
                        <tr>
                          <th>{language.textPackage.order.total}</th>
                          <td>{order.getTotal()}</td>
                        </tr>
                        <tr>
                          <th>{language.textPackage.order.paid}</th>
                          <td>
                            <input onChange={this.handleOrderChange.bind(this)} type="text" placeholder={paid.toFixed(2)} className="form-control" ref="paid" defaultValue={paid.toFixed(2)} />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                {/*<!-- /.col -->*/}
              </div>
              {/*<!-- /.row -->*/}

              {/*<!-- this row will not appear when printing -->*/}
              <div className="row no-print">
                <div className="col-xs-12">
                  <button className="btn btn-default" onClick={window.print}><i className="fa fa-print"></i> {language.textPackage.button.print}</button>
                  <button className="btn btn-success pull-right" disabled={this.state.formValidationMap.size > 0 ? true : false} onClick={onSave}><i className="fa fa-save"></i> {language.textPackage.button.save}</button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}