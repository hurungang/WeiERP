import * as express from 'express';
import { APIResult } from '../model/models';
import { IController, Controller } from './controller';
import Logger from '../server/logger';
import * as crypto from 'crypto'
import { SECRET_KEY } from "../config/commonConfig";

const logger = new Logger("WeChatController");

export default class WeChatController extends Controller {

  constructor() {
    super();
    logger.info("WeChatController constructed");
  }

  public validate(req: express.Request, res: express.Response, next: express.Next) {
    this.safeHandle(req, res, next,
      (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

        /* start of business logic */
        let signature = req.params.signature;
        let timestamp = req.params.timestamp;
        let nonce = req.params.nonce;
        let echostr = req.params.echostr;
        if (this.checkSignature(signature, timestamp, nonce,SECRET_KEY)) {
          res.send(echostr);   // 确认来源是微信，并把echostr返回给微信服务器。
        } else {
          result = this.unauthorizedRequest(result,"Source not from wechat server");
          this.handleResult(res,next,result);
          }
        /* end of business logic */
      }
    );

    
  }

  private checkSignature = function (signature, timestamp, nonce, token) {
    var tmpArr = [token, timestamp, nonce];
    tmpArr.sort();                           // 1.将token、timestamp、nonce三个参数进行字典序排序
    var tmpStr = tmpArr.join('');            // 2.将三个参数字符串拼接成一个字符串tmpStr    
    var shasum = crypto.createHash('sha1');
    shasum.update(tmpStr);
    var shaResult = shasum.digest('hex');    // 3.字符串tmpStr进行sha1加密
    if (shaResult === signature) {             // 4.加密后的字符串与signature对比，确定来源于微信
      return true;
    }
    return false;
  }

  
  public chat(req: express.Request, res: express.Response, next: express.Next) {
    this.safeHandle(req, res, next,
      (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

        /* start of business logic */
        let message = req.weixin;
        res.reply("success");
        /* end of business logic */
      }
    );
  }
}