import * as express from "express";
import OrderController from "../controller/orderController";
import Logger from '../server/logger';

const logger = new Logger("OrderRouter");

export default class OrderRouter {

  constructor() {
    let router = express.Router();
    let orderController = new OrderController();
    router.get('/', orderController.list.bind(orderController));
    router.post('/', orderController.create.bind(orderController));
    router.put('/:id', orderController.update.bind(orderController));
    router.get('/:id', orderController.getById.bind(orderController));
    router.delete('/:id', orderController.deleteById.bind(orderController));
    logger.info('register order router');
    return router;
  }
}
