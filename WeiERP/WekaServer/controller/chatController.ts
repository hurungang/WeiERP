import * as express from 'express';
import { APIResult, User } from '../model/models';
import { IController, Controller } from './controller';
import OrderAssembler from '../util/orderAssembler'
import * as StringSimilarity from 'string-similarity'
import Logger from '../server/logger';
import { OrderDAO, ProductDAO, IOrderModel, IProductModel, UserDAO, IUserModel, TokenDAO } from "../model/schemas";
import { IProduct, IOrder, OAuthToken } from "../model/models";
import { ObjectID } from "mongodb";
import { ErrorCode } from "../model/enums";
import * as OAuth from 'wechat-oauth';
import DataUtil from '../util/dataUtil'
import * as commonConfig from "../config/commonConfig"
import * as serverConfig from "../config/serverConfig"
import * as messageConfig from "../config/messageConfig"
import * as moment from 'moment'

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
        let fromUserName = req.body.xml.fromusername[0];
        this.handleOrder(content, fromUserName, req, res, next);
        /* end of business logic */
      }
    );
  }

  public textChat(message: any, req: express.Request, res: express.Response, next: express.Next) {
    this.safeHandle(req, res, next,
      (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

        var url = serverConfig.OAUTH_CLIENT.getAuthorizeURL(serverConfig.SERVER_DOMAIN + '/wechat/oauth', 'state', 'snsapi_base');
        /* start of business logic */
        let content = message.Content || '';
        let fromUserName = message.FromUserName;
        if (/help/.test(content) || /帮助/.test(content) || /HELP/.test(content)) {
          res.reply(url);
        } else if (/里约/.test(content) || /奥运/.test(content) || /奖牌/.test(content) || /2016/.test(content)) {
          res.reply('奥运奖牌');
        } else {
          //res.reply('正在生成订单，请稍侯...');
          this.handleOrder(content, fromUserName, req, res, next);
        }
        /* end of business logic */
      }
    );
  }

  public oauth(req: express.Request, res: express.Response, next: express.Next) {
    let code = req.query.code;
    serverConfig.OAUTH_CLIENT.getAccessToken(code, function (err, result) {
      if (result && result.data) {
        let accessToken = result.data.access_token;
        let openid = result.data.openid;
        let token = DataUtil.encrypt(openid);
        let searchUser = new User();
        let globalOAuthTokens:Map<string,OAuthToken> = req.app.get("GlobalOAuthTokens");
        searchUser.referenceID = openid;
        UserDAO.findOne(searchUser)
          .then((user: IUserModel) => {
            if (user == null) {
              let tempUser = new UserDAO(searchUser);
              tempUser.name = tempUser.referenceID;
              tempUser.save().exec();
            } else {
              let needRegister = true;
              if(user.name&&user.password){
                needRegister = false;
              }
              globalOAuthTokens.set(token,{token:token,user:User,expiredAfter:moment().add(30,"m")});
              res.redirect(`/web/#/?${needRegister?"register=true":""}&token=${token}`);
            }
          })
          .then((user: IUserModel) => {
            if(user){
              globalOAuthTokens.set(token,{token:token,user:User,expiredAfter:moment().add(30,"m")});
              res.redirect(`/web/#/?register=true&token=${token}`);
            }
          })
          .catch((err: string) => {
            res.redirect(`/web/error`);
          });;
      } else {
        logger.error(err);
      }
    });
  }

  private handleOrder(content: string, fromUserName: string, req: express.Request, res: express.Response, next: express.Next) {
    let result = new APIResult();
    let orderAssembler = new OrderAssembler(content);
    //find Product
    let order = orderAssembler.order;
    let searchUser = new User();
    searchUser.referenceID = fromUserName;

    if (orderAssembler.successful) {
      //find user, otherwise create new user
      UserDAO.findOne(searchUser)
        .then((user: IUserModel) => {
          if (user == null) {
            let tempUser = new UserDAO(searchUser);
            tempUser.name = tempUser.referenceID;
            tempUser.save()
              .then((savedUser: IUserModel) => {
                order.user = savedUser;
                this.saveProductAndOrder(order, req, res, next, result);
              })
              .catch((err: string) => {
                result = this.internalError(result, err);
                //this.handleWechatResult(res, next, result);
              });
          } else {
            order.user = user;
            this.saveProductAndOrder(order, req, res, next, result);
          }
        })

    } else {
      result = this.badRequest(result, ErrorCode[ErrorCode.OrderAssembleFailed]);
      //this.handleWechatResult(res, next, result);
    }
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
            });
        }

      })
      .catch((err: string) => {
        result = this.internalError(result, err);
      });
  }

  private saveOrder(order: IOrder, req: express.Request, res: express.Response, next: express.Next, result: APIResult) {
    var newOrder = new OrderDAO(order);
    let globalOAuthTokens:Map<string,OAuthToken> = req.app.get("GlobalOAuthTokens");
    newOrder
      .save()
      .then((order: IOrderModel) => {
        result.payload = order;
        
        globalOAuthTokens.set(DataUtil.encrypt(order.user.referenceID),{token:DataUtil.encrypt(order.user.referenceID),user:User,expiredAfter:moment().add(30,"m")});
        res.reply(messageConfig.ORDER_REPLY(order));
      })
      .catch((err: string) => {
        result = this.internalError(result, err);
      });
  }
}