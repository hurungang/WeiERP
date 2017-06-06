import * as express from 'express';
import { APIResult, BulkActionPayload, User, Product } from '../model/models';
import { IUserModel, UserDAO, ConsigneeDAO, ProductDAO } from '../model/schemas';
import { IController, Controller } from './controller';
import Logger from '../server/logger';
import * as jwt from 'jsonwebtoken';
import * as commonConfiguration from '../config/commonConfig';

const logger = new Logger("UserController");

export default class UserController extends Controller implements IController {

    constructor() {
        super();
        logger.info("UserController constructed");
    }

    public create(req: express.Request, res: express.Response, next: express.Next) {
        this.safeHandle(req, res, next,
            (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

                /* start of business logic */
                var newUser = new UserDAO(req.body);
                newUser
                    .save()
                    .then((user: IUserModel) => {
                        result.payload = user;
                        this.handleResult(res, next, result);
                    })
                    .catch((err: any) => {
                        result = this.internalError(result, err.toString());
                        this.handleResult(res, next, result);
                    });
                /* end of business logic */

            }
        );
    }

    public list(req, res, next) {
        this.safeHandle(req, res, next,
            (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {

                /* start of business logic */
                UserDAO.find({}).populate("user").exec()
                    .then((users: any) => {
                        result.payload = users;
                        this.handleResult(res, next, result);
                    })
                    .catch((err: any) => {
                        result = this.internalError(result, err.toString());
                        this.handleResult(res, next, result);
                    });
                /* end of business logic */

            }
        );
    }

    public authenticate(req, res, next) {
        this.safeHandle(req, res, next,
            (req: express.Request, res: express.Response, next: express.Next, result: APIResult) => {
                /* start of business logic */
                let endUser = req.body;
                let logonUser: IUserModel;
                UserDAO.findOne({ name: endUser.name, password: endUser.password }).exec()
                    .then((user: IUserModel) => {
                        if (user) {
                            result.payload = user;
                            var token = jwt.sign(user, commonConfiguration.SECRET_KEY, {
                                expiresIn: commonConfiguration.TOKEN_EXPIRES_IN_SECONDS
                            });
                            result.token = token;
                            logonUser = user;
                            return ConsigneeDAO.find({ user: user._id }).exec();
                        } else {
                            this.unauthorizedRequest(result, null);
                            this.handleResult(res, next, result);
                        }
                    })
                    .then((consignees: any) => {
                        logonUser.consignees = consignees;
                        return ProductDAO.find({ user: logonUser._id }).exec();
                    })
                    .then((products: any) => {
                        logonUser.products = products;
                        result.payload = logonUser;
                        this.handleResult(res, next, result);
                    })
                    .catch((err: any) => {
                        result = this.internalError(result, err.toString());
                        this.handleResult(res, next, result);
                    });
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
                        result = this.internalError(result, err.toString());
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
                let newUser = req.body;
                var query = { '_id': newUser.id };
                UserDAO.findOneAndUpdate(query, req.body, { upsert: false, new: true, runValidators: true })
                    .then((user: IUserModel) => {
                        result.payload = user;
                        this.handleResult(res, next, result);
                    })
                    .catch((err: any) => {
                        result = this.internalError(result, err.toString());
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
                        result = this.internalError(result, err.toString());
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
                        result = this.internalError(result, err.toString());
                        this.handleResult(res, next, result);
                    });
                /* end of business logic */

            }
        );
    }

}