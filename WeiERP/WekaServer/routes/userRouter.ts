import * as express from "express";
import UserController from "../controller/userController";
import Logger from '../server/logger';
import ProtectedRouter from "./protectedRouter";

const logger = new Logger("UserRouter");

export default class UserRouter extends ProtectedRouter{

  constructor() {
    let router = super() as any;
    let userController = new UserController();
    
    router.get('/', userController.list.bind(userController));
    router.post('/', userController.save.bind(userController));
    router.put('/', userController.update.bind(userController));
    router.patch('/', userController.bulkUpdate.bind(userController));
    router.get('/:id', userController.getById.bind(userController));
    router.delete('/:id', userController.deleteById.bind(userController));
    logger.info('register user router');
    return router;
  }
}
