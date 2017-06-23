import * as express from 'express';
import { APIResult, BulkActionPayload, User, Product, OAuthToken } from '../model/models';
import { IUserModel, UserDAO, ConsigneeDAO, ProductDAO } from '../model/schemas';
import { IController, Controller } from './controller';
import Logger from '../server/logger';
import * as jwt from 'jsonwebtoken';
import * as commonConfiguration from '../config/commonConfig';
import { ErrorCode } from "../model/enums";

const logger = new Logger("UserController");

export default class UserController extends Controller implements IController {

    constructor() {
        super();
        logger.info("UserController constructed");
    }

    public save(req: express.Request, res: express.Response, next: express.Next) {
        this.safeHandle(req, res, next,
            (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

                /* start of business logic */
                let user: User = req.body;
                let tempUser = this.getUserByToken(req);
                if (tempUser) {
                    user.referenceID = tempUser.referenceID;
                }
                if (user.id || user.referenceID) {
                    this.update(req, res, next);
                } else {

                    var newUser = new UserDAO(req.body);
                    newUser
                        .save()
                        .then((user: IUserModel) => {
                            result.payload = user;
                            this.handleResult(res, next, result);
                        })
                        .catch((err: any) => {
                            result = this.internalError(result, ErrorCode.UserCreateFailed, err.toString());
                            this.handleResult(res, next, result);
                        });
                }
                /* end of business logic */

            }
        );
    }

    public list(req, res, next) {
        this.safeHandle(req, res, next,
            (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

                /* start of business logic */
                UserDAO.find({}).populate("user").exec()
                    .then((user: any) => {
                        result.payload = user;
                        result.token = jwt.sign(user, commonConfiguration.SECRET_KEY, {
                            expiresIn: commonConfiguration.TOKEN_EXPIRES_IN_SECONDS
                        });
                        this.handleResult(res, next, result);
                    })
                    .catch((err: any) => {
                        result = this.internalError(result, ErrorCode.UserListFailed, err.toString());
                        this.handleResult(res, next, result);
                    });
                /* end of business logic */

            }
        );
    }

    private getUserByToken(req: express.Request):User {
        let tempUser;
        let token = req.body.token;
        if (token) {
            let globalOAuthTokens: Map<string, OAuthToken> = req.app.get("GlobalOAuthTokens");
            let authObj = globalOAuthTokens.get(token);
            if (authObj) {
                tempUser = authObj.user;
                globalOAuthTokens.delete(token);
            }
        }
        return tempUser;
    }
    public authenticate(req, res, next) {
        this.safeHandle(req, res, next,
            (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {
                /* start of business logic */
                let endUser = req.body;
                let tempUser = this.getUserByToken(req);
                if (tempUser) {
                    endUser = tempUser;
                }
                let logonUser: IUserModel;
                if (endUser.name && endUser.password) {

                    UserDAO.findOne({ name: endUser.name, password: endUser.password }).exec()
                        .then((user: IUserModel) => {
                            if (user) {
                                result.payload = user;
                                result.token = jwt.sign(user, commonConfiguration.SECRET_KEY, {
                                    expiresIn: commonConfiguration.TOKEN_EXPIRES_IN_SECONDS
                                });
                                logonUser = user;
                                return ConsigneeDAO.find({ user: user._id }).exec();
                            } else {
                                this.unauthorizedRequest(result);
                                this.handleResult(res, next, result);
                            }
                        })
                        .then((consignees: any) => {
                            if (logonUser) {
                                logonUser.consignees = consignees;
                                return ProductDAO.find({ user: logonUser._id }).exec();
                            }
                        })
                        .then((products: any) => {
                            if (logonUser) {
                                logonUser.products = products;
                                result.payload = logonUser;
                                this.handleResult(res, next, result);
                            }
                        })
                        .catch((err: any) => {
                            result = this.internalError(result,ErrorCode.UserAuthenticateFailed, err.toString());
                            this.handleResult(res, next, result);
                        });
                }
                else {
                    result = this.badRequest(result);
                    this.handleResult(res, next, result);
                }
                /* end of business logic */
            }
        );
    }


    public getById(req, res, next) {
        this.safeHandle(req, res, next,
            (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

                /* start of business logic */
                let user: User;
                let queryUserId;
                UserDAO.findById(req.params.id).exec()
                    .then((userModel: IUserModel) => {
                        user = userModel;
                        queryUserId = userModel._id;
                        return ConsigneeDAO.find({ user: queryUserId }).exec();
                    })
                    .then((consignees: any) => {
                        user.consignees = consignees;
                        return ProductDAO.find({ user: queryUserId }).exec();
                    })
                    .then((products: any) => {
                        user.products = products;
                        result.payload = user;
                        this.handleResult(res, next, result);
                    })
                    .catch((err: any) => {
                        result = this.internalError(result,ErrorCode.UserGetFailed, err.toString());
                        this.handleResult(res, next, result);
                    });
                /* end of business logic */

            }
        );
    }


    public update(req, res, next) {
        this.safeHandle(req, res, next,
            (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

                /* start of business logic */
                let newUser: User = req.body;

                var query = {};
                if (newUser.id) {
                    query = { '_id': newUser.id };
                } else if (newUser.referenceID) {
                    query = { 'referenceID': newUser.referenceID };
                } else if (newUser.name) {
                    query = { 'name': newUser.name };
                }

                UserDAO.findOneAndUpdate(query, req.body, { upsert: false, new: true, runValidators: true })
                    .then((user: IUserModel) => {
                        result.payload = user;
                        result.token = jwt.sign(user, commonConfiguration.SECRET_KEY, {
                                    expiresIn: commonConfiguration.TOKEN_EXPIRES_IN_SECONDS
                                });
                        this.handleResult(res, next, result);
                    })
                    .catch((err: any) => {
                        result = this.internalError(result, ErrorCode.UserUpdateFailed,err.toString());
                        this.handleResult(res, next, result);
                    });
                /* end of business logic */

            }
        );
    }


    public bulkUpdate(req, res, next) {
        this.safeHandle(req, res, next,
            (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

                /* start of business logic */
                let payload: BulkActionPayload = req.body;
                var query = { '_id': { $in: payload.idList } };
                UserDAO.update(query, payload.applyChange, { multi: true })
                    .then(() => {
                        UserDAO.find({}).exec()
                            .then((users: any) => {
                                result.payload = users;
                                this.handleResult(res, next, result);
                            })
                            .catch((err: any) => {
                                result = this.internalError(result, err.toString());
                                this.handleResult(res, next, result);
                            });
                    })
                    .catch((err: any) => {
                        result = this.internalError(result, ErrorCode.UserBulkUpdateFailed,err.toString());
                        this.handleResult(res, next, result);
                    });
                /* end of business logic */

            }
        );
    }


    public deleteById(req, res, next) {
        this.safeHandle(req, res, next,
            (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

                /* start of business logic */
                UserDAO.findByIdAndRemove(req.params.id)
                    .then((user: IUserModel) => {
                        result.payload = user;
                        this.handleResult(res, next, result);
                    })
                    .catch((err: any) => {
                        result = this.internalError(result, ErrorCode.UserDeleteFailed,err.toString());
                        this.handleResult(res, next, result);
                    });
                /* end of business logic */

            }
        );
    }

}