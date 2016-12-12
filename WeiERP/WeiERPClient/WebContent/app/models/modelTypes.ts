import {Status} from './enums'

export interface Localization {
  applicationName: string;
}

export interface Config {
  runtime: {mode:string;api:any};
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


export class Order {
  id?: number;
  senderName: string;
  senderAddress: string;
  senderPhone:string;
  consigneeName: string;
  consigneeAddress: string;
  consigneePhone:string;
  createTime: Date;
  orderItems: OrderItem[];
  tax: number;
  shipping: number;
  paid: number;
  paidTime: Date;
  status: Status;
  constructor(){
    
  }
  
  getSubtotal = function():number{
    let subtotal:number = 0;
    this.orderItems.map((orderItem:OrderItem)=>{
      subtotal += orderItem.productOrderPrice*orderItem.productQuantity;
    });
    return subtotal;
  }
  
  getTotal = function():number {
    let total:number = this.getSubtotal();
    total += this.tax + this.shipping;
    return total;
  }
}

export interface OrderItem {
  id?: number;
  product: Product;
  productQuantity: number;
  productCost: number;
  productOrderPrice: number;
}

export interface Product {
  id?: number;
  productName: string;
  productSN?: string;
  productSummary: string;
  productDetail?: string;
  productPrice: number;
  productUnit?: string;
}


export interface DataList<T> {
	header: any;
	data: T[];
}

export class Error {
	errorCode: string;
	errorDetail?: string;
}