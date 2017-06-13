import { TokenDAO } from "../model/schemas";
import * as OAuth from 'wechat-oauth';
import * as commonConfig from "../config/commonConfig"

export const OAUTH_CLIENT = new OAuth(commonConfig.WECHAT_CONFIG.appid, commonConfig.WECHAT_CONFIG.appsecret, function (openid, callback) {
      // 传入一个根据openid获取对应的全局token的方法
      // 在getUser时会通过该方法来获取token
      TokenDAO.getToken(openid, callback);
    }, function (openid, token, callback) {
      // 持久化时请注意，每个openid都对应一个唯一的token!
      TokenDAO.setToken(openid, token, callback);
    });
    
export const DB_URL = "mongodb://localhost/Weka";
export const DB_NAME = "Weka Database";
export const SERVER_DOMAIN = "http://ec2-13-58-68-0.us-east-2.compute.amazonaws.com";
