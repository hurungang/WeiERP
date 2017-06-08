import * as express from "express";
import * as cors from "cors"
import * as bodyParser from "body-parser";
import * as xmlBodyParser from "express-xml-bodyparser";
import * as winston from "winston";
import * as expressWinston from "express-winston";
import * as commonConfiguration from '../config/commonConfig';
import * as tokenVerifier from '../middleware/tokenVerifier';
import Database from './database';
import OrderRouter from '../routes/orderRouter'
import ChatRouter from '../routes/chatRouter'
import UserRouter from '../routes/userRouter'
import WeChatRouter from '../routes/weChatRouter'
import AuthenticationRouter from '../routes/authenticationRouter'
import Logger from './logger'
import { Environment } from "../model/models";


const logger = new Logger("Server");

export default class Server {

  public app: express.Application;
  public database: Database;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    //create expressjs application
    this.app = express();
      
    //configure application
    this.config();

    //add routes
    this.routes();

    //add static
    this.static();
    //add api
    this.run();
  }

  public run() {
    this.app.use(function(err,req,res,next) {
      console.log(err.stack);
      res.status(500).send({"Error" : err.stack});
    });
    let port = process.env.NODE_ENV=="development" as Environment ? commonConfiguration.SERVER_PORT_DEV : commonConfiguration.SERVER_PORT;
    this.app.listen(port, function () {
      logger.info(commonConfiguration.APP_NAME+' listening on port '+port+'!');
    });
  }

  public config() {    
    var expresslogger = expressWinston.logger({
      transports: [
        new (winston.transports.File)({ filename: commonConfiguration.LOG_FILE_EXPRESS })
      ]
    });
    this.app.use(expresslogger);
    this.app.use(xmlBodyParser());
    this.app.use(bodyParser.json()); // for parsing application/json
    this.app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    //allow cross domain
    this.app.use(cors());
    this.database = new Database();
  }

  public static(){
    this.app.use('/web',express.static( '../WekaClient/WebContent'));
  }
  public routes() {
    //empty for now
    this.app.get('/', function (req, res) {
      res.send(commonConfiguration.WELCOME_WORD);
    });
    let router = express.Router();
    router.use("/order",new OrderRouter());
    router.use("/chat",new ChatRouter());
    router.use("/user",new UserRouter());
    router.use("/authentication",new AuthenticationRouter());
    router.use("/wechat",new WeChatRouter());
    this.app.use(router);
      
  }
}
