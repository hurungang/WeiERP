import {HTTPStatusCode} from './enums'
import { IOrder, IOrderItem, IProduct } from './schemas'

export class APIResult {
  successful: Boolean = true;
  statusCode?: HTTPStatusCode = HTTPStatusCode.OK;
  errorMessage?: string;
  payload: any;
  formatError(){};
}

export class Order implements IOrder {  
  id: string;
  consigneeName: string;
  consigneeAddress: string;
  consigneePhone: string;
  senderName: string;
  senderAddress: string;
  senderPhone: string;
  createTime: Date;
  tax: number;
  shipping: number;
  paid: number;
  paidTime: Date;
  status: string;
  rawMessage: string;
  orderItems: IOrderItem[];
  constructor(){
    this.createTime = new Date();
  }
}

export class OrderItem implements IOrderItem {
  id: string;
  product: IProduct;
  productQuantity: number;
  productCost: number;
  productOrderPrice: number;
}

export class Product implements IProduct {
  id: string;
  productName: string;
  productSN: string;
  productSummary: string;
  productDetail: string;
  productPrice: number;
  productUnit: string;
  createTime: Date;
}