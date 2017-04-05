import * as mongoose from 'mongoose';
import * as serverConfig from '../config/serverConfig';
import Logger from './logger'

const logger = new Logger("Database");

export default class Database {
    
    private database: any;
    
    constructor(){
        this.initialize();
        this.connect();
    }
    
    private initialize(){
        mongoose.connection.on("connected", (ref) => {
          logger.info("Connected to DB "+ serverConfig.DB_NAME);
          });
        
        // If the connection throws an error
        mongoose.connection.on("error", (err) => {
          logger.error('Failed to connect to DB ' + serverConfig.DB_NAME + ' on startup '+ err);
        });
        
        // When the connection is disconnected
        mongoose.connection.on('disconnected', () => {
          logger.info('Mongoose default connection to DB :' + serverConfig.DB_NAME + ' disconnected');
        });

        
        // If the Node process ends, close the Mongoose connection
        process.on('SIGINT', this.gracefulExit).on('SIGTERM', this.gracefulExit);
    }
    
            
    private gracefulExit (){ 
      mongoose.connection.close(
        ()=> {
        logger.info('Mongoose default connection with DB :' + serverConfig.DB_NAME + ' is disconnected through app termination');
        process.exit(0);
      });
    }
    
    private connect (){
        this.database = mongoose.connect(serverConfig.DB_URL);
    }
    
}
