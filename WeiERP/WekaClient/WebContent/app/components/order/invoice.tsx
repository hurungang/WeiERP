import * as React from 'react';
import * as dateFormater from 'dateformat' 
import { Order, OrderItem, Language } from '../../models/modelTypes'
import EditableSelect from "../elements/editableSelect";

interface InvoiceProps {
  order: Order;
  onClose: any;
  onSave: any;
  language: Language;
}
export default class Invoice extends React.Component<InvoiceProps, {}>{
  refs: {
    [key: string]: (Element);
    senderName: HTMLInputElement;
    senderPhone: HTMLInputElement;
    senderAddress: HTMLInputElement;
    consigneeName: HTMLInputElement;
    consigneePhone: HTMLInputElement;
    consigneeAddress: HTMLInputElement;
    comments: HTMLInputElement;
    tax: HTMLInputElement;
    shipping: HTMLInputElement;
    paid: HTMLInputElement;
  }

  handleOrderChange() {
    let { order } = this.props;
    order.senderName = this.refs.senderName.value;
    order.senderPhone = this.refs.senderPhone.value;
    order.senderAddress = this.refs.senderAddress.value;
    order.consigneeName = this.refs.consigneeName.value;
    order.consigneePhone = this.refs.consigneePhone.value;
    order.senderAddress = this.refs.senderAddress.value;
    order.comments = this.refs.comments.value;
    let newPaid = parseFloat(this.refs.paid.value);
    order.paid = newPaid!=NaN?newPaid:order.paid;
    let newShipping = parseFloat(this.refs.shipping.value);
    order.shipping = newShipping!=NaN?newShipping:order.shipping;
    let newTax = parseFloat(this.refs.tax.value);
    order.tax = newTax!=NaN?newTax:order.tax;
    this.forceUpdate();
  }

  handleOrderQuantityChange(orderItem: OrderItem, event: any) {
      let newQuantity = parseInt(event.target.value);
      orderItem.productQuantity = newQuantity!=NaN?newQuantity:orderItem.productQuantity;
      this.forceUpdate();

  }

  handleOrderProductPriceChange(orderItem: OrderItem, event: any) {
      let newPrice = parseFloat(event.target.value);
      orderItem.productOrderPrice = newPrice!=NaN?newPrice:orderItem.productOrderPrice;
      this.forceUpdate();
  }

  render() {
    let { order, onClose, onSave, language } = this.props;
    let orderCreateTime = order.createTime ? order.createTime.toLocaleString() : "";
    let orderPaidTime = order.paidTime ? order.paidTime.toLocaleString() : "";
    let paid = order.paid ? order.paid : 0;
    let tax = order.tax ? order.tax:0;
    let shipping = order.shipping ? order.shipping:0;

    let user = order.user;
    if(user){
      order.senderName = order.senderName?order.senderName:user.sender?user.sender:user.name?user.name:"";
      order.senderAddress = order.senderAddress?order.senderAddress:user.address?user.address:"";
      order.senderPhone = order.senderPhone?order.senderPhone:user.phone?user.phone:"";
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
                    <input type="text" onChange={this.handleOrderChange.bind(this)} className="form-control has-feedback-left" placeholder={order.senderName}  ref="senderName" defaultValue={order.senderName}/>
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
                    <input type="text" onChange={this.handleOrderChange.bind(this)} className="form-control has-feedback-left" placeholder={order.consigneeName} ref="consigneeName" defaultValue={order.consigneeName} />
                    <span className="fa fa-user form-control-feedback left" aria-hidden="true"></span>
                  </div>
                  <div className="col-md-12 col-sm-12 col-xs-12 form-group has-feedback">
                    <input type="text" onChange={this.handleOrderChange.bind(this)} className="form-control has-feedback-left" placeholder={order.consigneePhone} ref="consigneePhone" defaultValue={order.consigneePhone} />
                    <span className="fa fa-phone form-control-feedback left" aria-hidden="true"></span>
                  </div>
                  <div className="col-md-12 col-sm-12 col-xs-12 form-group has-feedback">
                    <input type="text" onChange={this.handleOrderChange.bind(this)} className="form-control has-feedback-left" placeholder={order.consigneeAddress} ref="consigneeAddress" defaultValue={order.consigneeAddress} />
                    <span className="fa fa-home form-control-feedback left" aria-hidden="true"></span>
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
                        <th>{language.textPackage.orderItem.productQuantity}</th>
                        <th>{language.textPackage.orderItem.product}</th>
                        <th>{language.textPackage.product.productPrice}</th>
                        <th>{language.textPackage.orderItem.productOrderPrice}</th>
                        <th>{language.textPackage.orderItem.subtotal}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems.map((orderItem, index) => {
                        let productPrice = orderItem.product.productPrice ? orderItem.product.productPrice : 0.0;
                        let productOrderPrice = orderItem.productOrderPrice ? orderItem.productOrderPrice : productPrice;
                        let productQuantity = orderItem.productQuantity ? orderItem.productQuantity : 0;
                        let orderItemSubtotal = productOrderPrice * productQuantity;
                        return (
                          <tr key={`tr_${index}`}>
                            <td>
                                <input type="text" onChange={this.handleOrderQuantityChange.bind(this, orderItem)} placeholder={productQuantity.toFixed(0)} className="form-control" defaultValue={productQuantity.toFixed(0)} />
                            </td>
                            <td>{orderItem.product.productName}</td>
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
                  <p className="lead">{language.textPackage.order.createTime}: {dateFormater(orderCreateTime,language.timeFormat)}</p>
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
                  <button className="btn btn-success pull-right" onClick={onSave}><i className="fa fa-save"></i> {language.textPackage.button.save}</button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}