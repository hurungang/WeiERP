import * as serverConfig from "../config/serverConfig"

export const ORDER_REPLY = (order) => `你的订单已生成,
收货人:\t${order.consigneeName}
收货地址:\t${order.consigneeAddress}
联系电话:\t${order.consigneePhone}
订单内容:
  ${order.orderItems.map((orderItem)=>`${orderItem.product.productName} - ${orderItem.productQuantity}
  `)}
点击查看:${serverConfig.SERVER_DOMAIN}/web/#/order/${order.id}`;