import * as express from "express";
import WeChatController from "../controller/weChatController";
import Logger from '../server/logger';
import ProtectedRouter from "./protectedRouter";

const logger = new Logger("WeChatRouter");

export default class WeChatRouter{

  constructor() {
    let router = express.Router();
    let weChatController = new WeChatController();
    router.get('/', weChatController.validate.bind(weChatController));
    logger.info('register wechat router');
    return router;
  }
}
