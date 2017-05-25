import * as express from "express";
import ProtectedRouter from "./protectedRouter"
import OrderController from "../controller/orderController";
import Logger from '../server/logger';

const logger = new Logger("OrderRouter");

export default class OrderRouter extends ProtectedRouter{

  constructor() {
    let router = super() as any;
    let orderController = new OrderController();
    router.get('/', orderController.list.bind(orderController));
    router.post('/', orderController.create.bind(orderController));
    router.put('/', orderController.update.bind(orderController));
    router.patch('/', orderController.bulkUpdate.bind(orderController));
    router.get('/:id', orderController.getById.bind(orderController));
    router.delete('/:id', orderController.deleteById.bind(orderController));
    logger.info('register order router');
    return router;
  }
}
