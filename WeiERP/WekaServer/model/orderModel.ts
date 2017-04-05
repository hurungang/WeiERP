import * as mongoose from 'mongoose'


let orderSchema: mongoose.Schema = new mongoose.Schema({
    "consigneeName" : String,
    "consigneeAddress" : String,
    "consigneePhone" : String,
    "senderName" : String,
    "senderAddress" : String,
    "senderPhone" : String,
    "createTime" : Date,
    "tax" : Number,
    "shipping" : Number,
    "paid" : Number,
    "paidTime" : Date,
    "status" : String
});

export interface IOrder 
{
    "consigneeName" : String,
    "consigneeAddress" : String,
    "consigneePhone" : String,
    "senderName" : String,
    "senderAddress" : String,
    "senderPhone" : String,
    "createTime" : Date,
    "tax" : Number,
    "shipping" : Number,
    "paid" : Number,
    "paidTime" : Date,
    "status" : String
}

export interface IOrderModel extends IOrder, mongoose.Document {
  _id: String;
}


export const OrderDAO = mongoose.model<IOrderModel>('orders', orderSchema);