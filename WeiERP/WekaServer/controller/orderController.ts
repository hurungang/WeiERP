import * as express from 'express';
import { APIResult } from '../model/models';
import { IOrderModel, OrderDAO } from '../model/schemas';
import { IController, Controller } from './controller';
import Logger from '../server/logger';

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
            this.handleResult(res,next,result);
          })
          .catch((err: string) => {
            result = this.internalError(result, err);
            this.handleResult(res,next,result);
          });
        /* end of business logic */

      }
    );
  }

  public list(req, res, next) {
    this.safeHandle(req, res, next,
      (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

        /* start of business logic */
        OrderDAO.find({})
          .then((orders: any) => {
            result.payload = orders;
            this.handleResult(res,next,result);
          })
          .catch((err: string) => {
            result = this.internalError(result, err);
            this.handleResult(res,next,result);
          });
        /* end of business logic */

      }
    );
  }

  public getById(req, res, next) {
    this.safeHandle(req, res, next,
      (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

        /* start of business logic */
        OrderDAO.findById(req.params.id).populate("orderItems.product").exec()
          .then((order: IOrderModel) => {
            result.payload = order;
            this.handleResult(res,next,result);
          })
          .catch((err: string) => {
            result = this.internalError(result, err);
            this.handleResult(res,next,result);
          });
        /* end of business logic */

      }
    );
  }


  public update(req, res, next) {
    this.safeHandle(req, res, next,
      (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

        /* start of business logic */
        var query = { '_id': req.params.id };
        OrderDAO.findOneAndUpdate(query, req.body, { upsert: false, new: true, runValidators: true })
          .then((order: IOrderModel) => {
            result.payload = order;
            this.handleResult(res,next,result);
          })
          .catch((err: string) => {
            result = this.internalError(result, err);
            this.handleResult(res,next,result);
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
            this.handleResult(res,next,result);
          })
          .catch((err: string) => {
            result = this.internalError(result, err);
            this.handleResult(res,next,result);
          });
        /* end of business logic */

      }
    );
  }
}