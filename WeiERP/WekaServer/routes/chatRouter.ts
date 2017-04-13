import * as express from "express";
import ChatController from "../controller/chatController";
import Logger from '../server/logger';

const logger = new Logger("ChatRouter");

export default class ChatRouter {

  constructor() {
    let router = express.Router();
    let chatController = new ChatController();
    router.post('/', chatController.chat.bind(chatController));
    logger.info('register chat router');
    return router;
  }
}
