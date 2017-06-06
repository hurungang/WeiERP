import * as express from 'express';
import { APIResult, BulkActionPayload, Consignee } from '../model/models';
import { IOrderModel, OrderDAO, IProductModel, ProductDAO, ConsigneeDAO } from '../model/schemas';
import { IController, Controller } from './controller';
import * as StringSimilarity from 'string-similarity'
import Logger from '../server/logger';
import { ObjectID } from "mongodb";

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
        /* end of business logic */

      }
    );
  }

  public list(req, res, next) {
    this.safeHandle(req, res, next,
      (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

        /* start of business logic */
        OrderDAO.find({}).populate("user").populate("orderItems.product").exec()
          .then((orders: any) => {
            result.payload = orders;
            this.handleResult(res, next, result);
          })
          .catch((err: any) => {
            result = this.internalError(result, err.toString());
            this.handleResult(res, next, result);
          });
        /* end of business logic */

      }
    );
  }

  public getById(req, res, next) {
    this.safeHandle(req, res, next,
      (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

        /* start of business logic */
        OrderDAO.findById(req.params.id).populate("user").populate("orderItems.product").exec()
          .then((order: IOrderModel) => {
            result.payload = order;
            this.handleResult(res, next, result);
          })
          .catch((err: any) => {
            result = this.internalError(result, err.toString());
            this.handleResult(res, next, result);
          });
        /* end of business logic */

      }
    );
  }


  public update(req, res, next) {
    this.safeHandle(req, res, next,
      (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

        /* start of business logic */
        let newOrder: IOrderModel = req.body;
        let productsToCreate: IProductModel[] = [];
        var query = { '_id': newOrder.id };
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
                .then((results) => {
                  if (result.successful) {
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
                  result = this.internalError(result, err);
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
                  result = this.internalError(result, err);
                  this.handleResult(res, next, result);
                });

            }
          })
          .catch((err: any) => {
            result = this.internalError(result, err.toString());
            this.handleResult(res, next, result);
          });
          
        /* end of business logic */

      }
    );
  }


  public bulkUpdate(req, res, next) {
    this.safeHandle(req, res, next,
      (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

        /* start of business logic */
        let payload: BulkActionPayload = req.body;
        var query = { '_id': { $in: payload.idList } };
        OrderDAO.update(query, payload.applyChange, { multi: true })
          .then(() => {
            OrderDAO.find({}).populate("user").populate("orderItems.product").exec()
              .then((orders: any) => {
                result.payload = orders;
                this.handleResult(res, next, result);
              })
              .catch((err: any) => {
                result = this.internalError(result, err.toString());
                this.handleResult(res, next, result);
              });
          })
          .catch((err: any) => {
            result = this.internalError(result, err.toString());
            this.handleResult(res, next, result);
          });
        /* end of business logic */

      }
    );
  }


  public deleteById(req, res, next) {
    this.safeHandle(req, res, next,
      (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

        /* start of business logic */
        OrderDAO.findByIdAndRemove(req.params.id)
          .then((order: IOrderModel) => {
            result.payload = order;
            this.handleResult(res, next, result);
          })
          .catch((err: any) => {
            result = this.internalError(result, err.toString());
            this.handleResult(res, next, result);
          });
        /* end of business logic */

      }
    );
  }

}