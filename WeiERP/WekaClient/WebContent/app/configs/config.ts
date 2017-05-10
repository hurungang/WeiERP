import { Config, Language, Localization } from '../models/modelTypes';
import * as moment from 'moment';

let config: Config = new Config();
config.runtime = {
		mode: "TEST", //TEST|PRODUCTION
		api: {
			order: "http://localhost/order",
			user: "http://localhost/user",
		},
	};
let localization = new Localization("Chinese");
let Chinese = new Language("Chinese");
let English = new Language("English");
localization.addLanguage(Chinese);
localization.addLanguage(English);
config.localization = localization;
Chinese.currency = "¥";
Chinese.dateFormat = "yyyy-mm-dd";
Chinese.timeFormat = "yyyy-mm-dd HH:MM"
Chinese.textPackage.applicationName = "Vedaleon 管理";
Chinese.textPackage.invoiceTitle = "订单详情";
Chinese.textPackage.orderListTitle = "订单列表";
Chinese.textPackage.currencyInfo = "价格单位 - 元";

Chinese.textPackage.order = {
	id : "订单号",
    user: "用户",
    consigneeName: "收货人",
    consigneeAddress: "收货地址",
    consigneePhone: "收货人电话",
    senderName: "发货人",
    senderAddress: "发货地址",
    senderPhone: "发货人电话",
    createTime: "订单时间",
    tax: "税费",
    shipping: "运费",
    paid: "已付",
    paidTime: "付款时间",
    status: "状态",
    rawMessage: "原始消息",
    orderItems: "订单项",
    comments: "备注",
    subtotal: "小计",
    total: "合计",
};
Chinese.textPackage.orderItem = {
    id: "编号",
    product: "商品",
    productQuantity: "商品数量",
    productCost: "商品成本",
    productOrderPrice: "订单价格",
    subtotal: "小计",
};
Chinese.textPackage.product = {
    id: "商品号",
    user: "用户",
    productName: "商品名",
    productSN: "商品序列号",
    productSummary: "商品摘要",
    productDetail: "商品详情",
    productPrice: "商品价格",
    productUnit: "商品单位",
    createTime: "创建时间",
};
Chinese.textPackage.button = {
    save: "保存",
    delete: "删除",
    update: "更新",
    print: "打印",
};
Chinese.textPackage.timeRangePicker = {
      format: 'YYYY-MM-DD HH:mm',
      separator: ' - ',
      applyLabel: '确定',
      cancelLabel: '取消',
      weekLabel: 'W',
      customRangeLabel: 'Custom Range',
      daysOfWeek: moment.weekdaysMin(),
      monthNames: moment.monthsShort(),
      firstDay: moment.localeData().firstDayOfWeek(),
}

English.textPackage.timeRangePicker = {
      format: 'YYYY-MM-DD HH:mm',
      separator: ' - ',
      applyLabel: 'Apply',
      cancelLabel: 'Cancel',
      weekLabel: 'W',
      customRangeLabel: 'Custom Range',
      daysOfWeek: moment.weekdaysMin(),
      monthNames: moment.monthsShort(),
      firstDay: moment.localeData().firstDayOfWeek(),
};
English.textPackage.applicationName = "Vedaleon Admin";

export default config;