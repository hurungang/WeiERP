import * as mongoose from 'mongoose'



let orderItemSchema :  mongoose.Schema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
  productQuantity: Number,
  productCost: Number,
  productOrderPrice: Number
});

let orderSchema: mongoose.Schema = new mongoose.Schema({
    consigneeName : String,
    consigneeAddress : String,
    consigneePhone : String,
    senderName : String,
    senderAddress : String,
    senderPhone : String,
    createTime : Date,
    tax : Number,
    shipping : Number,
    paid : Number,
    paidTime : Date,
    status : String,
    rawMessage : String,
    orderItems : [orderItemSchema]
});

let productSchema :  mongoose.Schema = new mongoose.Schema({
  productName: String,
  productSN: String,
  productSummary: String,
  productDetail: String,
  productPrice: String,
  productUnit: String,
});

export interface IOrder 
{
    consigneeName : String,
    consigneeAddress : String,
    consigneePhone : String,
    senderName : String,
    senderAddress : String,
    senderPhone : String,
    createTime : Date,
    tax : Number,
    shipping : Number,
    paid : Number,
    paidTime : Date,
    status : String,
    rawMessage : String,
    orderItems : IOrderItem[]
}

export interface IOrderItem 
{
  product: IProduct,
  productQuantity: Number,
  productCost: Number,
  productOrderPrice: Number
}

export interface IProduct 
{
  productName: String,
  productSN?: String,
  productSummary: String,
  productDetail: String,
  productPrice: Number,
  productUnit: String,
}

export interface IOrderModel extends IOrder, mongoose.Document {
  _id: String;
}

export interface IOrderItemModel extends IOrderItem, mongoose.Document {
  _id: String;
}

export interface IProductModel extends IProduct, mongoose.Document {
  _id: String;
}

export const OrderDAO = mongoose.model<IOrderModel>('orders', orderSchema);
export const ProductDAO = mongoose.model<IOrderModel>('products', productSchema);