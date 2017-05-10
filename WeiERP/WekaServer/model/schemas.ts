import * as mongoose from 'mongoose'
import { IOrder, IOrderItem, IProduct, IUser } from './models'

let orderItemSchema: mongoose.Schema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
  productQuantity: Number,
  productCost: Number,
  productOrderPrice: Number
});

let orderSchema: mongoose.Schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
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
  orderItems: [orderItemSchema],
  comments: String
});


let productSchema: mongoose.Schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  productName: String,
  productSN: String,
  productSummary: String,
  productDetail: String,
  productPrice: Number,
  productUnit: String,
  createTime: Date,
});

let userSchema: mongoose.Schema = new mongoose.Schema({
  name: String,
  source: String,
  referenceID: String,
  address: String,
  phone: String,
  sender: String,
  createTime: Date,
});
orderItemSchema.virtual('id').get(function(){return this._id.toHexString()});
orderSchema.virtual('id').get(function(){return this._id.toHexString()});
productSchema.virtual('id').get(function(){return this._id.toHexString()});
userSchema.virtual('id').get(function(){return this._id.toHexString()});

orderItemSchema.set('toJSON',{virtuals:true})
orderSchema.set('toJSON',{virtuals:true})
productSchema.set('toJSON',{virtuals:true})
userSchema.set('toJSON',{virtuals:true})

export interface IOrderModel extends IOrder, mongoose.Document {

}

export interface IOrderItemModel extends IOrderItem, mongoose.Document {

}

export interface IProductModel extends IProduct, mongoose.Document {

}
export interface IUserModel extends IUser, mongoose.Document {

}
export const OrderDAO = mongoose.model<IOrderModel>('orders', orderSchema);
export const ProductDAO = mongoose.model<IProductModel>('products', productSchema);
export const UserDAO = mongoose.model<IUserModel>('users', userSchema);