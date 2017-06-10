import * as mongoose from 'mongoose'
import { IOrder, IOrderItem, IProduct, IUser, IManifest } from './models'

let orderItemSchema: mongoose.Schema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
  productQuantity: Number,
  productCost: Number,
  productOrderPrice: Number
});

let orderSchema: mongoose.Schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  manifest: { type: mongoose.Schema.Types.ObjectId, ref: 'manifests'},
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

let consigneeSchema: mongoose.Schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  consigneeName: String,
  consigneeAddresses: [String],
  consigneePhone: String,
  createTime: Date,
})

let productSchema: mongoose.Schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  productName: String,
  productSN: String,
  productSummary: String,
  productDetail: String,
  productPrice: Number,
  productUnit: String,
  createTime: Date,
  stock: Number,
});

let userSchema: mongoose.Schema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  fullName: String,
  source: String,
  referenceID: String,
  address: String,
  phone: String,
  sender: String,
  createTime: Date,
  consignees: [consigneeSchema],
  products: [productSchema]
});

let manifestSchema: mongoose.Schema = new mongoose.Schema({
  name: String,
  comments: String,
  createTime: Date,
  shipTime: Date,
})


orderItemSchema.virtual('id').get(function(){return this._id.toHexString()});
orderSchema.virtual('id').get(function(){return this._id.toHexString()});
productSchema.virtual('id').get(function(){return this._id.toHexString()});
userSchema.virtual('id').get(function(){return this._id.toHexString()});
manifestSchema.virtual('id').get(function(){return this._id.toHexString()});
consigneeSchema.virtual('id').get(function(){return this._id.toHexString()});

orderItemSchema.set('toJSON',{virtuals:true})
orderSchema.set('toJSON',{virtuals:true})
productSchema.set('toJSON',{virtuals:true})
userSchema.set('toJSON',{virtuals:true})
manifestSchema.set('toJSON',{virtuals:true})
consigneeSchema.set('toJSON',{virtuals:true})

export interface IOrderModel extends IOrder, mongoose.Document {

}

export interface IOrderItemModel extends IOrderItem, mongoose.Document {

}

export interface IProductModel extends IProduct, mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
}
export interface IUserModel extends IUser, mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
}
export interface IManifestModel extends IManifest, mongoose.Document {

}
export interface IConsigneeModel extends IManifest, mongoose.Document {

}
export const OrderDAO = mongoose.model<IOrderModel>('orders', orderSchema);
export const ProductDAO = mongoose.model<IProductModel>('products', productSchema);
export const UserDAO = mongoose.model<IUserModel>('users', userSchema);
export const ManifestDAO = mongoose.model<IUserModel>('manifests', userSchema);
export const ConsigneeDAO = mongoose.model<IConsigneeModel>('consignee', consigneeSchema);

let TokenSchema: mongoose.Schema = new mongoose.Schema({
  access_token: String,
  expires_in: Number,
  refresh_token: String,
  openid: String,
  scope: String,
  create_at: String
});

TokenSchema.statics.getToken = function (openid, cb) {
  this.findOne({openid:openid}, function (err, result) {
    if (err) throw err;
    return cb(null, result);
  });
};

TokenSchema.statics.setToken = function (openid, token, cb) {
  // 有则更新，无则添加
  var query = {openid: openid};
  var options = {upsert: true};
  this.update(query, token, options, function (err, result) {
    if (err) throw err;
    return cb(null);
  });
};

export const TokenDAO = mongoose.model('tokens', TokenSchema);