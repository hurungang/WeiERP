import * as serverConfig from "../config/serverConfig"
import { OAUTH_CLIENT } from "../config/serverConfig";
import { IOrderModel } from "../model/schemas";
import DataUtil from '../util/dataUtil'


export const ORDER_REPLY = (order:IOrderModel) => {
  
  return `你的订单已生成,
收货人:\t${order.consigneeName}
收货地址:\t${order.consigneeAddress}
联系电话:\t${order.consigneePhone}
订单内容:
  ${order.orderItems.map((orderItem)=>`${orderItem.product.productName} - ${orderItem.productQuantity}
  `)}
点击查看:${OAUTH_CLIENT.getAuthorizeURL(serverConfig.SERVER_DOMAIN + '/web/#/order/'+order.id+"?token="+DataUtil.encrypt(order.user.referenceID), DataUtil.encrypt(order.user.referenceID), 'snsapi_base')}`;
}