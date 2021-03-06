import * as express from 'express';
import { HTTPStatusCode, ErrorCode } from '../model/enums';
import Logger from '../server/logger'
import { APIResult, Environment } from '../model/models'

export interface IController {
  save(req: any, res: any, next: any);
  change?(req: any, res: any, next: any);
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
  public internalError(result: APIResult, errorCode?: ErrorCode, errorMessage?:string): APIResult {
    result.statusCode = HTTPStatusCode.InternalServerError;
    result.errorCode = errorCode;
    if(process.env.NODE_ENV as Environment != "production"){
      result.errorMessage = errorMessage; 
    }
    return result;
  }

  public badRequest(result: APIResult, errorCode?: ErrorCode, errorMessage?:string): APIResult {
    result.statusCode = HTTPStatusCode.BadRequest;
    result.errorCode = errorCode;
    if(process.env.NODE_ENV as Environment != "production"){
      result.errorMessage = errorMessage; 
    }
    return result;
  }

  public unauthorizedRequest(result: APIResult, error?: string): APIResult {
    result.statusCode = HTTPStatusCode.Unauthorized;
    result.errorCode = ErrorCode.UnauthorizedRequest;
    result.errorMessage = error;
    return result;
  }
}