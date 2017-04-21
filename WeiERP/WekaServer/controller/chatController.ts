import * as express from 'express';
import { APIResult } from '../model/models';
import { IController, Controller } from './controller';
import OrderAssembler from '../util/orderAssembler'
import * as StringSimilarity from 'string-similarity'
import Logger from '../server/logger';
import { OrderDAO, ProductDAO, IOrderModel, IProductModel, IProduct } from "../model/schemas";

const logger = new Logger("ChatController");

export default class ChatController extends Controller {

  constructor() {
    super();
    logger.info("ChatController constructed");
  }

  public chat(req: express.Request, res: express.Response, next: express.Next) {
    this.safeHandle(req, res, next,
      (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

        /* start of business logic */
        let content = req.body.xml.content[0];
        let orderAssembler = new OrderAssembler(content);
        //find Product
        let order = orderAssembler.order;

        if (orderAssembler.successful) {
          ProductDAO.find({})
            .then((productList: IProductModel[]) => {
              logger.debug("Product List:" + productList.length);
              let productsToCreate: IProduct[] = [];
              for (let tempOrderItem of order.orderItems) {
                logger.debug("load:" + tempOrderItem.product.productName);
                let tempProduct = tempOrderItem.product;
                let tempProductName = tempProduct.productName;
                let similarity = 0;
                for (let product of productList) {
                  let tempSimilarity = StringSimilarity.compareTwoStrings(product.productName, tempProductName);
                  if (tempSimilarity > similarity) {
                    similarity = tempSimilarity;
                    tempProduct = product;
                  }
                }
                logger.debug(similarity + tempProduct.productName);
                if (similarity > 0.5) {
                  tempOrderItem.product = tempProduct;
                } else {
                  productsToCreate.push(tempOrderItem.product);
                }
              }

              ProductDAO.collection.insertMany(productsToCreate)
                .then((results) => {
                  
                  var newOrder = new OrderDAO(orderAssembler.order);
                  newOrder
                    .save()
                    .then((order: IOrderModel) => {
                      result.payload = order;
                      this.handleResult(res, next, result);
                    })
                    .catch((err: string) => {
                      result = this.internalError(result, err);
                      this.handleResult(res, next, result);
                    });
                });

            })
            .catch((err: string) => {
              result = this.internalError(result, err);
              this.handleResult(res, next, result);
            });
          /* end of business logic */

        }
      }
    );
  }
}