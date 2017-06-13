import * as crypto from 'crypto'

export default class DataUtils {
  public static encrypt(...args:string[]):string{
    
        let tmpArr = args;
        tmpArr.sort();                           // 1.将token、timestamp、nonce三个参数进行字典序排序
        let tmpStr = tmpArr.join('');            // 2.将三个参数字符串拼接成一个字符串tmpStr    
        let shasum = crypto.createHash('sha1');
        shasum.update(tmpStr);
        let token = shasum.digest('hex');    // 3.字符串tmpStr进行sha1加密作为token
        return token;
  }
}