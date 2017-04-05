import * as React from 'react';
import {Order} from '../../models/modelTypes'

interface InvoiceProps {order:Order}
export default class Invoice extends React.Component<InvoiceProps,{}>{
  
  render(){
	let {order} = this.props;
    return (
            <div className="col-md-12 col-sm-12 col-xs-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Invoice of Order <small>{order.id}</small></h2>
                  <ul className="nav navbar-right panel_toolbox">
                    <li><a className="collapse-link"><i className="fa fa-chevron-up"></i></a>
                    </li>
                    <li><a className="close-link"><i className="fa fa-close"></i></a>
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
                                        <i className="fa fa-globe"></i> Invoice.
                                        <small className="pull-right">Date: {order.createTime.toUTCString()}</small>
                                    </h1>
                      </div>
                      {/*<!-- /.col -->*/}
                    </div>
                    {/*<!-- info row -->*/}
                    <div className="row invoice-info">
                      <div className="col-sm-4 invoice-col">
                        From
                        <br/><strong>{order.senderName}</strong>
                        <br/><span>{order.senderPhone}</span>
                        <br/><address>
                          {order.senderAddress}
                                    </address>
                      </div>
                      {/*<!-- /.col -->*/}
                      <div className="col-sm-4 invoice-col">
                        To
                        <br/><strong>{order.consigneeName}</strong>
                        <br/><span>{order.consigneePhone}</span>
                        <br/><address>
                        	{order.consigneeAddress}
                                    </address>
                      </div>
                      {/*<!-- /.col -->*/}
                      <div className="col-sm-4 invoice-col">
                        <b>Invoice #INV{order.id}</b>
                        <br/>
                        <br/>
                        <b>Order ID:</b> {order.id}
                        <br/>
                        <b>Payment Due:</b> {order.paidTime.toDateString()}
                        <br/>
                        <b>Account:</b> 968-34567
                      </div>
                      {/*<!-- /.col -->*/}
                    </div>
                    {/*<!-- /.row -->*/}

                    {/*<!-- Table row -->*/}
                    <div className="row">
                      <div className="col-xs-12 table">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>Qty</th>
                              <th>Product</th>
                              <th>Serial #</th>
                              <th>Description</th>
                              <th>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                          {order.orderItems.map((orderItem,index)=>{
                            return (
                            <tr key={`tr_${index}`}>
                              <td>{orderItem.productQuantity}</td>
                              <td>{orderItem.product.productName}</td>
                              <td>{orderItem.product.id}</td>
                              <td>{orderItem.product.productSummary}</td>
                              <td>${orderItem.productOrderPrice}</td>
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
                        <p className="lead">Payment Methods:</p>
                        <img src="images/visa.png" alt="Visa"/>
                        <img src="images/mastercard.png" alt="Mastercard"/>
                        <img src="images/american-express.png" alt="American Express"/>
                        <img src="images/paypal.png" alt="Paypal"/>
                        <p className="text-muted well well-sm no-shadow">
                          Etsy doostang zoodles disqus groupon greplin oooj voxy zoodles, weebly ning heekya handango imeem plugg dopplr jibjab, movity jajah plickers sifteo edmodo ifttt zimbra.
                        </p>
                      </div>
                      {/*<!-- /.col -->*/}
                      <div className="col-xs-6">
                        <p className="lead">Amount Due 2/22/2014</p>
                        <div className="table-responsive">
                          <table className="table">
                            <tbody>
                              <tr>
                                <th>Subtotal:</th>
                                <td>${order.getSubtotal()}</td>
                              </tr>
                              <tr>
                                <th>Tax (9.3%)</th>
                                <td>${order.tax}</td>
                              </tr>
                              <tr>
                                <th>Shipping:</th>
                                <td>${order.shipping}</td>
                              </tr>
                              <tr>
                                <th>Total:</th>
                                <td>${order.getTotal()}</td>
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
                        <button className="btn btn-default" onClick={window.print}><i className="fa fa-print"></i> Print</button>
                        <button className="btn btn-success pull-right"><i className="fa fa-credit-card"></i> Submit Payment</button>
                        <button className="btn btn-primary pull-right"><i className="fa fa-download"></i> Generate PDF</button>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
    );
}}