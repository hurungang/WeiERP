import * as serverConfig from "../config/serverConfig"
import { OAUTH_CLIENT } from "../config/serverConfig";
import { IOrderModel } from "../model/schemas";
import DataUtil from '../util/dataUtil'


export const ORDER_REPLY = (order:IOrderModel) => {
  
  return `你的订单已生成, 系统可能对收货信息和商品做了自动匹配，如有需要请修改
收货人:\t${order.consigneeName}
收货地址:\t${order.consigneeAddress}
联系电话:\t${order.consigneePhone}
订单内容:
  ${order.orderItems.map((orderItem)=>`${orderItem.product.productName} - ${orderItem.productQuantity}
  `)}
点击查看:${serverConfig.OAUTH_CLIENT.getAuthorizeURL(serverConfig.SERVER_DOMAIN + '/wechat/oauth/order/'+order.id, '', 'snsapi_base')}`;
}