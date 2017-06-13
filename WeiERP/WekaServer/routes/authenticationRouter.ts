import * as express from "express";
import UserController from "../controller/userController";
import Logger from '../server/logger';

const logger = new Logger("AuthenticationRouter");

export default class AuthenticationRouter{

  constructor() {
    let router = express.Router();
    let userController = new UserController();
    
    router.post('/', userController.authenticate.bind(userController));
    router.get('/', userController.authenticate.bind(userController));
    router.put('/', userController.create.bind(userController));
    logger.info('register authentication router');
    return router;
  }
}
