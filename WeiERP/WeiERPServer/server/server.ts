import * as express from "express";
import * as cors from "cors"
import * as bodyParser from "body-parser";
import * as winston from "winston";
import * as expressWinston from "express-winston";
import * as commonConfiguration from '../config/commonConfig';
import Database from './database';
import OrderRouter from '../routes/orderRouter'
import Logger from './logger'


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

    //add api
    this.run();
  }


  public run() {
    this.app.use(function(err,req,res,next) {
      console.log(err.stack);
      res.status(500).send({"Error" : err.stack});
    });
    this.app.listen(3000, function () {
      logger.info(commonConfiguration.APP_NAME+' listening on port 3000!');
    });
  }

  public config() {    
    var expresslogger = expressWinston.logger({
      transports: [
        new (winston.transports.File)({ filename: commonConfiguration.LOG_FILE_EXPRESS })
      ]
    });
    this.app.use(expresslogger);
    this.app.use(bodyParser.json()); // for parsing application/json
    this.app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    //allow cross domain
    this.app.use(cors());
    this.database = new Database();
  }

  public routes() {
    //empty for now
    this.app.get('/', function (req, res) {
      res.send(commonConfiguration.WELCOME_WORD);
    });
    let router = express.Router();
    router.use("/order",new OrderRouter());
    this.app.use(router);
      
  }
}
