import * as express from 'express';
import { APIResult } from '../model/models';
import { IController, Controller } from './controller';
import MessageAnalyst from '../util/messageAnalyst'
import Logger from '../server/logger';

const logger = new Logger("ChatController");

export default class ChatController extends Controller{

  constructor() {
    super();
    logger.info("ChatController constructed");
  }

  public chat(req: express.Request, res: express.Response, next: express.Next) {
    this.safeHandle(req, res, next,
      (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

        /* start of business logic */
        let messageAnalyst = new MessageAnalyst(req.body.xml.content[0])
        res.json(req.body.xml.content[0]);
        /* end of business logic */

      }
    );
  }
}