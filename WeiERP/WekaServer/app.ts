import Server from './server/server';
import * as commonConfiguration from './config/commonConfig';

console.log("Load Configuration:"+JSON.stringify(commonConfiguration));
Server.bootstrap();