import * as express from "express";
import WeChatController from "../controller/weChatController";
import Logger from '../server/logger';
import ProtectedRouter from "./protectedRouter";
import ChatController from "../controller/chatController";
import * as commonConfiguration from '../config/commonConfig';
import * as wechat from 'wechat'

const logger = new Logger("WeChatRouter");

export default class WeChatRouter {

  constructor() {
    let router = express.Router();
    // let weChatController = new WeChatController();
    // let chatController = new ChatController();
    // router.get('/', weChatController.validate.bind(weChatController));
    // //router.post('/', weChatController.hello.bind(weChatController));
    // router.post('/', chatController.chat.bind(chatController));
    // logger.info('register wechat router');
    router.all('/', wechat(commonConfiguration.WECHAT_CONFIG).text(function (message, req, res, next) {

      var content = message.Content || '';
      if (/help/.test(content) || /帮助/.test(content) || /HELP/.test(content)) {
        res.reply('Hi,小编等你很久了\n输入 帮助 或 help 获取帮助');
      } else if (/里约/.test(content) || /奥运/.test(content) || /奖牌/.test(content) || /2016/.test(content)) {
        res.reply('奥运奖牌');
      } else {
        res.reply('您的反馈已收到,我们会定时回复.');
      }

    }).image(function (message, req, res, next) {

      res.reply('图已收到');
    }).voice(function (message, req, res, next) {

      res.reply('语音已收到');
    }).video(function (message, req, res, next) {

      res.reply('视频已收到');
    }).location(function (message, req, res, next) {

      res.reply('地理位置已收到');
    }).link(function (message, req, res, next) {

      res.reply('链接已收到');
    }).event(function (message, req, res, next) {
      switch (message.Event) {
        case 'subscribe':
          var openid = message.FromUserName;

          res.reply('欢迎关注一介布衣公众号');
          break;
        case 'unsubscribe':
          var openid = message.FromUserName;

          res.reply('亲,请不要离开我!!');
          break;
        default:
          res.send('');
      }

    }).device_text(function (message, req, res, next) {

      res.reply('设备消息已收到');
    }).device_event(function (message, req, res, next) {

      res.reply('设备事件已收到');
    }).middlewarify());
    return router;
  }
}
