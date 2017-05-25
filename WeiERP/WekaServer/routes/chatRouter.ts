import * as express from "express";
import ChatController from "../controller/chatController";
import Logger from '../server/logger';
import ProtectedRouter from "./protectedRouter";

const logger = new Logger("ChatRouter");

export default class ChatRouter extends ProtectedRouter{

  constructor() {
    let router = super() as any;
    let chatController = new ChatController();
    router.post('/', chatController.chat.bind(chatController));
    logger.info('register chat router');
    return router;
  }
}
