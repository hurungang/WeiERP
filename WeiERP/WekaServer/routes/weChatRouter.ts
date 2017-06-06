import * as express from "express";
import WeChatController from "../controller/weChatController";
import Logger from '../server/logger';
import ProtectedRouter from "./protectedRouter";
import ChatController from "../controller/chatController";

const logger = new Logger("WeChatRouter");

export default class WeChatRouter{

  constructor() {
    let router = express.Router();
    let weChatController = new WeChatController();
    let chatController = new ChatController();
    router.get('/', weChatController.validate.bind(weChatController));
    router.post('/', weChatController.hello.bind(weChatController));
    // router.post('/', chatController.chat.bind(chatController));
    logger.info('register wechat router');
    return router;
  }
}
