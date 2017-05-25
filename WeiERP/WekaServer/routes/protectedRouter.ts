import * as express from "express";
import tokenVerifier from "../middleware/tokenVerifier"

export default class ProtectedRouter{
    constructor(){
        let router = express.Router();
        router.use(tokenVerifier);
        return router;
    }
}