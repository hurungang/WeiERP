import * as jwt from 'jsonwebtoken'
import * as commonConfiguration from '../config/commonConfig';
import { IUserModel } from "../model/schemas";
import { APIResult } from "../model/models";
import { HTTPStatusCode, ErrorCode } from "../model/enums";

export default function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, commonConfiguration.SECRET_KEY, function(err, decoded) {  
      if (err) {
        let result:APIResult = new APIResult();
        result.statusCode = HTTPStatusCode.Unauthorized;
        result.errorCode = ErrorCode.UnauthorizedRequest;
        result.errorMessage = err;
        result.successful = false;
        return res.json(result);    
      } else {
        // if everything is good, save to request for use in other routes
        req.user = decoded._doc as IUserModel;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });

  }
}