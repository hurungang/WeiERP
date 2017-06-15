import * as express from 'express';
import { HTTPStatusCode } from '../model/enums';
import Logger from '../server/logger'
import { APIResult } from '../model/models'

export interface IController {
  create(req: any, res: any, next: any);
  update(req: any, res: any, next: any);
  deleteById(req: any, res: any, next: any);
  list(req: any, res: any, next: any);
  getById(req: any, res: any, next: any);
}

const logger = new Logger("Controller");

export class Controller {
  constructor() {
    logger.info("Controller constructed");
  }

  public safeHandle(req: express.Request, res: express.Response, next: express.Next,
    fn: (req: express.Request, res: express.Response, next: express.Next, result: APIResult)=>void){

    let result = new APIResult();
    try {
      fn(req, res, next, result);
    }
    catch (err) {
      result = this.badRequest(result, err.message);
      this.handleResult(res, next, result);
    }
  }

  public handleResult(res: express.Response, next: express.Next, result: APIResult) {
    result.successful = (result.statusCode == HTTPStatusCode.OK)? true : false
    res.json(result);
  }

  public handleWechatResult(res: express.Response, next: express.Next, result: APIResult) {
    result.successful = (result.statusCode == HTTPStatusCode.OK)? true : false
    res.send(result.successful?"success":result.errorMessage);
  }
  public internalError(result: APIResult, error: string): APIResult {
    result.statusCode = HTTPStatusCode.InternalServerError;
    result.errorMessage = error;
    return result;
  }

  public badRequest(result: APIResult, error: string): APIResult {
    result.statusCode = HTTPStatusCode.BadRequest;
    result.errorMessage = error;
    return result;
  }

  public unauthorizedRequest(result: APIResult, error?: string): APIResult {
    result.statusCode = HTTPStatusCode.Unauthorized;
    result.errorMessage = error;
    return result;
  }
}