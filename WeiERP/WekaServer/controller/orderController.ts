import * as express from 'express';
import { APIResult, BulkActionPayload, Consignee, IOrder, IProduct, OAuthToken } from '../model/models';
import { IOrderModel, OrderDAO, IProductModel, ProductDAO, ConsigneeDAO } from '../model/schemas';
import { IController, Controller } from './controller';
import * as StringSimilarity from 'string-similarity'
import Logger from '../server/logger';
import { ObjectID } from "mongodb";
import { ErrorCode } from "../model/enums";
import DataUtil from '../util/dataUtil'
import * as messageConfig from "../config/messageConfig"
import * as moment from 'moment'

const logger = new Logger("OrderController");

export default class OrderController extends Controller implements IController {

  constructor() {
    super();
    logger.info("OrderController constructed");
  }

  public save(req: express.Request, res: express.Response, next: express.Next) {
    this.safeHandle(req, res, next,
      (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

        /* start of business logic */
        var newOrder: IOrder = req.body;
        if (req.user && ((newOrder.id && newOrder.user.id == req.user._id) || (!newOrder.id))) {
          if (!newOrder.id) {
            newOrder.user = req.user;
          }
          this.saveOrder(newOrder, req, res, next, result);
        } else {
          result = this.unauthorizedRequest(result);
          this.handleResult(res, next, result);
        }
        /* end of business logic */

      }
    );
  }
  public change(req: express.Request, res: express.Response, next: express.Next) {
    this.safeHandle(req, res, next,
      (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {
          result = this.unauthorizedRequest(result);
          this.handleResult(res, next, result);
      });
  }

  public list(req, res, next) {
    this.safeHandle(req, res, next,
      (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

        /* start of business logic */
        if (req.user) {
          let queryObject = { user: new ObjectID.createFromHexString(req.user._id), isDeleted: { $ne: true } };
          OrderDAO.find(queryObject).populate("user").populate("orderItems.product").exec()
            .then((orders: any) => {
              result.payload = orders;
              this.handleResult(res, next, result);
            })
            .catch((err: any) => {
              result = this.internalError(result, ErrorCode.OrderListFailed, err.toString());
              this.handleResult(res, next, result);
            });
        } else {
          result = this.unauthorizedRequest(result);
          this.handleResult(res, next, result);
        }
        /* end of business logic */

      }
    );
  }

  public getById(req, res, next) {
    this.safeHandle(req, res, next,
      (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

        /* start of business logic */
        if (req.user) {
          OrderDAO.findById(req.params.id).populate("user").populate("orderItems.product").exec()
            .then((order: IOrderModel) => {
              if (order.user.id == req.user._id) {
                result.payload = order;
                this.handleResult(res, next, result);
              } else {
                result = this.unauthorizedRequest(result);
              }
              this.handleResult(res, next, result);
            })
            .catch((err: any) => {
              result = this.internalError(result, ErrorCode.OrderGetFailed, err.toString());
              this.handleResult(res, next, result);
            });
        } else {
          result = this.unauthorizedRequest(result);
          this.handleResult(res, next, result);
        }
        /* end of business logic */

      }
    );
  }


  private saveOrder(newOrder: IOrder, req: express.Request, res: express.Response, next: express.Next, result: APIResult) {

    /* start of business logic */

    let productsToCreate: IProductModel[] = [];

    let consignee = new Consignee();
    consignee.consigneePhone = newOrder.consigneePhone;
    consignee.user = newOrder.user;
    ConsigneeDAO.findOne(consignee).exec()
      .then((foundConsignee) => {
        let consigneeDAO;
        if (!foundConsignee) {
          consignee.consigneeAddresses = [newOrder.consigneeAddress];
          consignee.consigneeName = newOrder.consigneeName;
          consigneeDAO = new ConsigneeDAO(consignee);
        } else {
          let foundAddress = foundConsignee.consigneeAddresses.find((address) => {
            return StringSimilarity.compareTwoStrings(address, newOrder.consigneeAddress) > 0.8
          })
          if (!foundAddress) {
            foundConsignee.consigneeAddresses = foundConsignee.consigneeAddresses.concat(newOrder.consigneeAddress);
          }
          consigneeDAO = new ConsigneeDAO(foundConsignee);
        }
        return consigneeDAO.save();
      })
      .then(() => {

        for (let orderItem of newOrder.orderItems) {
          let product: IProductModel = orderItem.product as IProductModel;
          if (!product._id) {
            product._id = new ObjectID();
            product.createTime = new Date();
            product.user = newOrder.user;
            productsToCreate.push(product);
          }
        }
        if (productsToCreate.length > 0) {
          return ProductDAO.collection.insertMany(productsToCreate);
        }else{
          return Promise.resolve();
        }
      })
      .then(()=>{
          let query = { '_id': newOrder.id?newOrder.id:new ObjectID() };
          return OrderDAO.findOneAndUpdate(query, newOrder, { upsert: true, new: true })
            .populate("user").populate("orderItems.product");
      })
      .then((savedOrder: IOrderModel) => {
        result.payload = savedOrder;
        this.handleResult(res, next, result);
      })
      .catch((err: any) => {
        result = this.internalError(result, ErrorCode.OrderUpdateFailed, err.toString());
        this.handleResult(res, next, result);
      });;
    /* end of business logic */

  }


  public bulkUpdate(req, res, next) {
    this.safeHandle(req, res, next,
      (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

        /* start of business logic */
        if (req.user) {
          let payload: BulkActionPayload = req.body;
          var query = { '_id': { $in: payload.idList }, user: new ObjectID.createFromHexString(req.user._id) };
          OrderDAO.update(query, payload.applyChange, { multi: true })
            .then(() => {
              OrderDAO.find({ user: new ObjectID.createFromHexString(req.user._id), isDeleted: { $ne: true } }).populate("user").populate("orderItems.product").exec()
                .then((orders: any) => {
                  result.payload = orders;
                  this.handleResult(res, next, result);
                })
                .catch((err: any) => {
                  result = this.internalError(result, ErrorCode.OrderListFailed, err.toString());
                  this.handleResult(res, next, result);
                });
            })
            .catch((err: any) => {
              result = this.internalError(result, ErrorCode.OrderBulkUpdateFailed, err.toString());
              this.handleResult(res, next, result);
            });
        } else {
          result = this.unauthorizedRequest(result);
          this.handleResult(res, next, result);
        }
        /* end of business logic */

      }
    );
  }


  public deleteById(req, res, next) {
    this.safeHandle(req, res, next,
      (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

        /* start of business logic */
        if (req.user) {
          var query = { '_id': req.params.id, user: new ObjectID.createFromHexString(req.user._id) };
          OrderDAO.find(query).remove().exec()
            .then((writeResult) => {
              result.payload = writeResult;
              this.handleResult(res, next, result);
            })
            .catch((err: any) => {
              result = this.internalError(result, ErrorCode.OrderDeleteFailed, err.toString());
              this.handleResult(res, next, result);
            });
        } else {
          result = this.unauthorizedRequest(result);
          this.handleResult(res, next, result);
        }
        /* end of business logic */

      }
    );
  }


}