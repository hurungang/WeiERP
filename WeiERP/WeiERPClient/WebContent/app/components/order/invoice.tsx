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
                                        <small className="pull-right">Date: 16/08/2016</small>
                                    </h1>
                      </div>
                      {/*<!-- /.col -->*/}
                    </div>
                    {/*<!-- info row -->*/}
                    <div className="row invoice-info">
                      <div className="col-sm-4 invoice-col">
                        From
                        <address>
                                        <strong>Iron Admin, Inc.</strong>
                                        <br/>795 Freedom Ave, Suite 600
                                        <br/>New York, CA 94107
                                        <br/>Phone: 1 (804) 123-9876
                                        <br/>Email: ironadmin.com
                                    </address>
                      </div>
                      {/*<!-- /.col -->*/}
                      <div className="col-sm-4 invoice-col">
                        To
                        <address>
                        	{order.consigneeAddress}
                                    </address>
                      </div>
                      {/*<!-- /.col -->*/}
                      <div className="col-sm-4 invoice-col">
                        <b>Invoice #007612</b>
                        <br/>
                        <br/>
                        <b>Order ID:</b> {order.id}
                        <br/>
                        <b>Payment Due:</b> 2/22/2014
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
                            <tr>
                              <td>1</td>
                              <td>Call of Duty</td>
                              <td>455-981-221</td>
                              <td>El snort testosterone trophy driving gloves handsome gerry Richardson helvetica tousled street art master testosterone trophy driving gloves handsome gerry Richardson
                              </td>
                              <td>$64.50</td>
                            </tr>
                            <tr>
                              <td>1</td>
                              <td>Need for Speed IV</td>
                              <td>247-925-726</td>
                              <td>Wes Anderson umami biodiesel</td>
                              <td>$50.00</td>
                            </tr>
                            <tr>
                              <td>1</td>
                              <td>Monsters DVD</td>
                              <td>735-845-642</td>
                              <td>Terry Richardson helvetica tousled street art master, El snort testosterone trophy driving gloves handsome letterpress erry Richardson helvetica tousled</td>
                              <td>$10.70</td>
                            </tr>
                            <tr>
                              <td>1</td>
                              <td>Grown Ups Blue Ray</td>
                              <td>422-568-642</td>
                              <td>Tousled lomo letterpress erry Richardson helvetica tousled street art master helvetica tousled street art master, El snort testosterone</td>
                              <td>$25.99</td>
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
                                <td>$250.30</td>
                              </tr>
                              <tr>
                                <th>Tax (9.3%)</th>
                                <td>$10.34</td>
                              </tr>
                              <tr>
                                <th>Shipping:</th>
                                <td>$5.80</td>
                              </tr>
                              <tr>
                                <th>Total:</th>
                                <td>$265.24</td>
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