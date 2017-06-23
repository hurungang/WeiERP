import { HTTPStatusCode, StatusCode, ErrorCode } from './enums'
import { Type } from "class-transformer"
import 'reflect-metadata';
import { Moment } from "moment/moment";

export class DataItem {
  id?:string;
  equals(item:DataItem):boolean{return this.id&&item?this.id===item.id:false;};
}

export class APIResult {
  successful: Boolean = true;
  statusCode?: HTTPStatusCode = HTTPStatusCode.OK;
  errorMessage?: string;
  errorCode?: ErrorCode;
  payload: any;
  token?: string;
  formatError(){};
}

export interface IOrder {
  id?: string;
  user: IUser;
  consigneeName: string;
  consigneeAddress: string;
  consigneePhone: string;
  senderName: string;
  senderAddress?: string;
  senderPhone?: string;
  createTime: Date;
  tax?: number;
  shipping?: number;
  paid?: number;
  paidTime?: Date;
  status: string;
  rawMessage: string;
  orderItems: IOrderItem[];
  comments?: string;
  isDeleted?: boolean;
  agent?: string;
}

export interface IOrderItem {
  id?: string;
  product: IProduct;
  productQuantity: number;
  productCost?: number;
  productOrderPrice?: number;
  isDeleted?: boolean;
}

export interface IProduct {
  id?: string;
  user: IUser;
  productName: string;
  productSN?: string;
  productSummary?: string;
  productDetail?: string;
  productPrice?: number;
  productUnit?: string;
  createTime?: Date;
  isDeleted?: boolean;
}
export interface IUser {
  id?: string;
  name: string;
  email?: string;
  password?: string;
  fullName?: string;
  source?: string;
  referenceID?: string;
  address?: string;
  phone?: string;
  sender?: string;
  createTime?: Date;
  consignees?: Consignee[];
  products?: Product[];
  isDeleted?: boolean;
}

export interface IConsignee {
  user: IUser;
  consigneeName: string;
  consigneeAddresses: string[];
  consigneePhone: string;
  createTime: Date;
  isAgent?: boolean;
  isDeleted?: boolean;
}

export interface IManifest {
  id?: string;
  name: string;
  comments: string;
  createTime: Date;
  shipTime: Date;
  isDeleted?: boolean;
}

export class Order extends DataItem implements IOrder {

  id?: string;
  @Type(() => User)
  user: User;
  consigneeName: string;
  consigneeAddress: string;
  consigneePhone: string;
  senderName: string;
  senderAddress?: string;
  senderPhone?: string;
  @Type(() => Date)
  createTime: Date;
  tax?: number;
  shipping?: number;
  paid?: number;
  @Type(() => Date)
  paidTime?: Date;
  status: string;
  rawMessage: string;
  @Type(() => OrderItem)
  orderItems: OrderItem[];
  comments?: string;
  isDeleted?: boolean;
  agent?: string;

  constructor(){
    super();
    this.createTime = new Date();
    this.orderItems = [];
    this.status = StatusCode[StatusCode.Created];
  }

  public getSubtotal(): number {
    let subtotal: number = 0;
    this.orderItems.map((orderItem: OrderItem) => {
      let productPrice = orderItem.product&&orderItem.product.productPrice?orderItem.product.productPrice:0;
      let productOrderPrice = orderItem.productOrderPrice?orderItem.productOrderPrice:productPrice;
      subtotal += productOrderPrice * orderItem.productQuantity;
    });
    return subtotal;
  }

  public getTotal(): number {
    let total: number = this.getSubtotal();
    
    total += this.tax?this.tax:0 + this.shipping?this.shipping:0;
    return total;
  }

}

export class OrderItem implements IOrderItem {
  id?: string;
  @Type(() => Product)
  product: Product;
  productQuantity: number;
  productCost?: number;
  productOrderPrice?: number;
  isDeleted?: boolean;
}

export class Product implements IProduct {
  id?: string;
  user: IUser;
  productName: string;
  productSN?: string;
  productSummary?: string;
  productDetail?: string;
  productPrice?: number;
  productUnit?: string;
  @Type(() => Date)
  createTime?: Date;
  isDeleted?: boolean;
}

export class Consignee implements IConsignee {
  user: IUser;
  consigneeName: string;
  consigneeAddresses: string[];
  consigneePhone: string;
  createTime: Date;
  isAgent?: boolean;
  isDeleted?: boolean;
}

export class ModelWrapper{
  constructor(model?:any){
    if(model){
      return Object.assign(ModelWrapper.prototype,model);
    }
  }
}

export class User extends ModelWrapper implements IUser {
  id?: string;
  name: string;
  password?: string;
  source?: string;
  referenceID?: string;
  address?: string;
  phone?: string;
  sender?: string;
  @Type(() => Date)
  createTime?: Date;
  @Type(() => Consignee)
  consignees?: Consignee[];
  @Type(()=>Product)
  products?: Product[];
  isDeleted?: boolean;
}

export interface BulkActionPayload{
  idList: string[];
  applyChange: any;
}

export type Environment = "production" | "development";

export interface OAuthToken{
  token:string;
  user:User;
  expiredAfter: Moment;
}