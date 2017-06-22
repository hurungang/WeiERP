import * as express from 'express';
import { APIResult, BulkActionPayload, Consignee } from '../model/models';
import { IOrderModel, OrderDAO, IProductModel, ProductDAO, ConsigneeDAO } from '../model/schemas';
import { IController, Controller } from './controller';
import * as StringSimilarity from 'string-similarity'
import Logger from '../server/logger';
import { ObjectID } from "mongodb";
import { ErrorCode } from "../model/enums";

const logger = new Logger("OrderController");

export default class OrderController extends Controller implements IController {

  constructor() {
    super();
    logger.info("OrderController constructed");
  }

  public create(req: express.Request, res: express.Response, next: express.Next) {
    this.safeHandle(req, res, next,
      (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

        /* start of business logic */
        var newOrder = new OrderDAO(req.body);
        if (req.user && newOrder.id == req.user.id) {
          newOrder
            .save()
            .then((order: IOrderModel) => {
              result.payload = order;
              this.handleResult(res, next, result);
            })
            .catch((err: any) => {
              result = this.internalError(result, err.toString());
              this.handleResult(res, next, result);
            });
        }
        /* end of business logic */

      }
    );
  }

  public list(req, res, next) {
    this.safeHandle(req, res, next,
      (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

        /* start of business logic */
        if (req.user) {
          let queryObject = { user: new ObjectID.createFromHexString(req.user._id), isDeleted: {$ne: true} };
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


  public update(req, res, next) {
    this.safeHandle(req, res, next,
      (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

        /* start of business logic */
        if (req.user) {
          let newOrder: IOrderModel = req.body;
          let productsToCreate: IProductModel[] = [];
          var query = { '_id': newOrder.id, user: new ObjectID.createFromHexString(req.user._id) };
          OrderDAO.findOne(query).exec()
            .then((order) => {
              if (order != null) {

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
                      ProductDAO.collection.insertMany(productsToCreate)
                        .then((insertResults) => {
                          if (insertResults.successful) {
                            return OrderDAO.findOneAndUpdate(query, req.body, { upsert: false, new: true, runValidators: true })
                              .populate("user").populate("orderItems.product").exec();
                          } else {

                          }
                        })
                        .then((order: IOrderModel) => {
                          result.payload = order;
                          this.handleResult(res, next, result);
                        })
                        .catch((err: any) => {
                          result = this.internalError(result, ErrorCode.OrderCreateProductFailed, err.toString());
                          this.handleResult(res, next, result);
                        });
                    } else {


                      OrderDAO.findOneAndUpdate(query, req.body, { upsert: false, new: true, runValidators: true })
                        .populate("user").populate("orderItems.product")
                        .then((order: IOrderModel) => {
                          result.payload = order;
                          this.handleResult(res, next, result);
                        })
                        .catch((err: any) => {
                          result = this.internalError(result, ErrorCode.OrderUpdateFailed, err.toString());
                          this.handleResult(res, next, result);
                        });

                    }
                  });
              } else {
                result = this.unauthorizedRequest(result);
                this.handleResult(res, next, result);
              }
            })
            .catch((err: any) => {
              result = this.internalError(result, ErrorCode.OrderCreateAssigneeFailed, err.toString());
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


  public bulkUpdate(req, res, next) {
    this.safeHandle(req, res, next,
      (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

        /* start of business logic */
        if (req.user) {
          let payload: BulkActionPayload = req.body;
          var query = { '_id': { $in: payload.idList }, user: new ObjectID.createFromHexString(req.user._id) };
          OrderDAO.update(query, payload.applyChange, { multi: true })
            .then(() => {
              OrderDAO.find({}).populate("user").populate("orderItems.product").exec()
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