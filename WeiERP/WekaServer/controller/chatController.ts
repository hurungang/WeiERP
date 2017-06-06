import * as express from 'express';
import { APIResult, User } from '../model/models';
import { IController, Controller } from './controller';
import OrderAssembler from '../util/orderAssembler'
import * as StringSimilarity from 'string-similarity'
import Logger from '../server/logger';
import { OrderDAO, ProductDAO, IOrderModel, IProductModel,UserDAO,IUserModel } from "../model/schemas";
import { IProduct, IOrder} from "../model/models";
import { ObjectID } from "mongodb";
import { ErrorCode } from "../model/enums";

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
        let referenceID = req.body.xml.fromusername[0];
        let orderAssembler = new OrderAssembler(content);
        //find Product
        let order = orderAssembler.order;
        let searchUser = new User();
        searchUser.referenceID = referenceID;
        
        logger.debug("chat:" + JSON.stringify(order));
        if (orderAssembler.successful) {
          //find user, otherwise create new user
          UserDAO.findOne(searchUser)
            .then((user: IUserModel) => {
              if (user == null) {
                let tempUser = new UserDAO(searchUser);
                tempUser.save()
                .then((savedUser:IUserModel)=>{
                  order.user = savedUser;
                  this.saveProductAndOrder(order, req, res, next, result);
                })
              } else {
                order.user = user;
                this.saveProductAndOrder(order, req, res, next, result);
              }
            })

        } else {
          result = this.badRequest(result, ErrorCode[ErrorCode.OrderAssembleFailed]);
          this.handleResult(res, next, result);
        }
        /* end of business logic */
      }
    );
  }

  private saveProductAndOrder(order: IOrder, req: express.Request, res: express.Response, next: express.Next, result: APIResult) {

    ProductDAO.find({})
      .then((productList: IProductModel[]) => {
        //look up product, otherwise create new project
        let productsToCreate: IProduct[] = [];
        for (let tempOrderItem of order.orderItems) {
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
          if (similarity > 0.5) {
            tempOrderItem.product = tempProduct;
          } else {
            let newProduct = { _id: new ObjectID(), ...tempOrderItem.product };
            newProduct.createTime = new Date();
            newProduct.user = order.user;
            tempOrderItem.product = tempProduct;
            productsToCreate.push(newProduct);
          }
        }

        if (productsToCreate.length == 0) {
          this.saveOrder(order, req, res, next, result)
        } else {
          ProductDAO.collection.insertMany(productsToCreate)
            .then((results) => {
              if (result.successful) {
                this.saveOrder(order, req, res, next, result)
              }
            })
            .catch((err: string) => {
              result = this.internalError(result, err);
              this.handleResult(res, next, result);
            });
        }

      })
      .catch((err: string) => {
        result = this.internalError(result, err);
        this.handleResult(res, next, result);
      });
  }

  private saveOrder(order: IOrder, req: express.Request, res: express.Response, next: express.Next, result: APIResult) {
    var newOrder = new OrderDAO(order);
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
  }
}