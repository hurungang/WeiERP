import * as mongoose from 'mongoose'

let orderItemSchema: mongoose.Schema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
  productQuantity: Number,
  productCost: Number,
  productOrderPrice: Number
});

let orderSchema: mongoose.Schema = new mongoose.Schema({
  consigneeName: String,
  consigneeAddress: String,
  consigneePhone: String,
  senderName: String,
  senderAddress: String,
  senderPhone: String,
  createTime: Date,
  tax: Number,
  shipping: Number,
  paid: Number,
  paidTime: Date,
  status: String,
  rawMessage: String,
  orderItems: [orderItemSchema]
});

let productSchema: mongoose.Schema = new mongoose.Schema({
  productName: String,
  productSN: String,
  productSummary: String,
  productDetail: String,
  productPrice: String,
  productUnit: String,
});

export interface IOrder {
  id?: string;
  consigneeName: string,
  consigneeAddress: string,
  consigneePhone: string,
  senderName: string,
  senderAddress?: string,
  senderPhone?: string,
  createTime: Date,
  tax?: number,
  shipping?: number,
  paid?: number,
  paidTime?: Date,
  status: string,
  rawMessage: string,
  orderItems: IOrderItem[]
}

export interface IOrderItem {
  id?: string;
  product: IProduct,
  productQuantity: number,
  productCost?: number,
  productOrderPrice?: number
}

export interface IProduct {
  id?: string;
  productName: string,
  productSN?: string,
  productSummary?: string,
  productDetail?: string,
  productPrice?: number,
  productUnit?: string,
  createTime?: Date;
}

export interface IOrderModel extends IOrder, mongoose.Document {

}

export interface IOrderItemModel extends IOrderItem, mongoose.Document {

}

export interface IProductModel extends IProduct, mongoose.Document {

}

export const OrderDAO = mongoose.model<IOrderModel>('orders', orderSchema);
export const ProductDAO = mongoose.model<IProductModel>('products', productSchema);