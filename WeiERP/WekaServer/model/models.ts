import {HTTPStatusCode} from './enums'

export class APIResult {
  successful: Boolean = true;
  statusCode?: HTTPStatusCode = HTTPStatusCode.OK;
  errorMessage?: String;
  payload: any;
  formatError(){};
}