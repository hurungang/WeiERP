import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as commonConfiguration from '../config/commonConfig';

export default class Logger {
  private logger: winston.Logger;

  constructor(label: string) {

    this.logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({
          colorize: true,
          prettyPrint: true,
          timestamp: true,
          label: label,
        }),
        new winston.transports.DailyRotateFile({
          filename: commonConfiguration.LOG_FILE,
          datePattern: commonConfiguration.DATE_PATTERN,
          prepend: true,
          label: label,
          level: process.env.ENV === 'development' ? 'debug' : 'info'
        })
      ]
    });
  }

  info(logContent: string) {
    this.logger.log('info', logContent);
  }

  error(logContent: string) {
    this.logger.log('error', logContent);
  }

  debug(logContent: string) {
    this.logger.log('debug', logContent);
  }
}