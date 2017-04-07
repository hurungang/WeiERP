import { Status } from './enums'
import { plainToClass } from "class-transformer"
import { IOrderModel, IOrderItemModel, IProductModel } from 'WekaServer/model/orderModel'

export interface Localization {
  applicationName: string;
}

export interface Config {
  runtime: { mode: string; api: any };
  localization: any;
}

export class User {
  id?: number;
  name: string;
  password?: string;
}

export interface Menu {
  id: number;
  text: string;
  link: string;
  icon: string;
  subMenus?: Menu[];
}


export class Order implements IOrderModel{
  
  constructor() {

  }

  getSubtotal = function(): number {
    let subtotal: number = 0;
    this.orderItems.map((orderItem: OrderItem) => {
      subtotal += orderItem.productOrderPrice * orderItem.productQuantity;
    });
    return subtotal;
  }

  getTotal = function(): number {
    let total: number = this.getSubtotal();
    total += this.tax + this.shipping;
    return total;
  }
  _id: String;  consigneeName: String;  consigneeAddress: String;  consigneePhone: String;  senderName: String;  senderAddress: String;  senderPhone: String;  createTime: Date;  tax: Number;  shipping: Number;  paid: Number;  paidTime: Date;  status: String;}

export class OrderItem implements IOrderItemModel{
  
  product: Product;
  productQuantity: number;
  productCost: number;
  productOrderPrice: number;
  _id: String;
  
}

export class Product implements IProductModel {
  productName: String;
  productSN?: String;
  productSummary: String;
  productDetail: String;
  productPrice: number;
  productUnit: String;
  
  _id: String;
}

export class Error {
  errorCode: string;
  errorDetail?: string;
}

export class DataList<T>{
  data: T[];
  constructor(prototype: {new(): T; },data) {
    this.data = plainToClass(prototype, data);
  }
}