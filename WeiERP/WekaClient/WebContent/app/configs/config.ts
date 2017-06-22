import { Config, Language, Localization, OrderItem, ErrorCode } from '../models/modelTypes';
import * as moment from 'moment';
import { ClientErrorCode } from "../models/enums";
import TextFormater from "../utils/textFormater";
import { StatusCode } from "WekaServer/model/enums";
import * as dateFormater from 'dateformat'

let config: Config = new Config();
config.runtime = {
    mode: "TEST", //TEST|PRODUCTION
    api: {
        order: '/order/',
        user: "/user",
        authentication: "/authentication",
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
Chinese.textPackage.timeRangeFormat = new TextFormater("{1} 至 {2}");

Chinese.textPackage.predefinedRange = {
    today: "今天",
    yesterday: "昨天",
    last7Days: "前7天",
    last30Days: "前30天",
    thisMonth: "这个月",
    lastMonth: "上个月",
}
Chinese.textPackage.paginator = {
    entriesPerPage: "每页显示",
    pageRange: new TextFormater("{1} - {2}/共{3}"),
    entriesSelectArray: [{ name: 1, value: 1 }, { name: 10, value: 10 }, { name: 25, value: 25 }, { name: 50, value: 50 }, { name: 100, value: 100 }],
}
Chinese.textPackage.user = {
    bindTitle: "绑定用户",
    registerTitle: "注册用户",
    loginTitle: "登录",
    name: "姓名(必填)",
    password: "密码(必填)",
    passwordConfirm: "确认密码(必填)",
    senderName: "默认发货人(选填)",
    phone: "默认联系电话(选填)",
    address: "默认发货地址(选填)"
}
Chinese.textPackage.order = {
    id: "订单号",
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
    idColumn: "id",
    defaultEntriesPerPage: 25,
    bulkSend: "加入发货单",
    bulkChangeStatus: "修改状态",
    bulkDelete: "批量删除",
    statuses: {
        [StatusCode[StatusCode.Created]]: "待处理",
        [StatusCode[StatusCode.Paid]]: "已支付",
        [StatusCode[StatusCode.Printed]]: "已打印",
        [StatusCode[StatusCode.Sent]]: "已发货",
    },
    sendButtons: {
        newBatch: "新建发货批次",
    },
    changeStatusButtons: {
        [StatusCode[StatusCode.Created]]: "设为 待处理",
        [StatusCode[StatusCode.Paid]]: "设为 已支付",
        [StatusCode[StatusCode.Printed]]: "设为 已打印",
        [StatusCode[StatusCode.Sent]]: "设为 已发货",
    },
    emptyHeader: "全部",
};

Chinese.textPackage.orderExportHeader = {
    id: Chinese.textPackage.order.id,
    senderName: Chinese.textPackage.order.senderName,
    senderAddress: Chinese.textPackage.order.senderAddress,
    senderPhone: Chinese.textPackage.order.senderPhone,
    consigneeName: Chinese.textPackage.order.consigneeName,
    consigneeAddress: Chinese.textPackage.order.consigneeAddress,
    consigneePhone: Chinese.textPackage.order.consigneePhone,
    orderItems:  {label: Chinese.textPackage.order.orderItems, callback: (value: OrderItem[]) => value.reduce((valueString:string,orderItem:OrderItem)=>{
        return `${valueString} \r\n ${orderItem.product.productName} - [${orderItem.productQuantity}]`;
    },"")
    },
    status: { label: Chinese.textPackage.order.status, callback: (value) => Chinese.textPackage.order.statuses[value] },
    createTime: { label: Chinese.textPackage.order.createTime, callback: (value) => dateFormater(value, Chinese.timeFormat) },
}

Chinese.textPackage.orderHeader = {
    //id: Chinese.textPackage.order.id,
    consigneeName: Chinese.textPackage.order.consigneeName,
    consigneeAddress: Chinese.textPackage.order.consigneeAddress,
    consigneePhone: Chinese.textPackage.order.consigneePhone,
    status: { label: Chinese.textPackage.order.status, callback: (value) => Chinese.textPackage.order.statuses[value] },
    createTime: { label: Chinese.textPackage.order.createTime, callback: (value) => dateFormater(value, Chinese.timeFormat) },
}

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
    create: "创建",
    bulkAction: "批量操作",
    refresh: "刷新",
    addOrderItem: "增加订单项",
    export: "导出",
    login: "登录",
    logout: "注销",
    register: "注册",
    bind: "绑定",
};
Chinese.textPackage.errorMessage = {
    [ClientErrorCode.ORDER_API_ERROR]: "订单接口错误",
    [ClientErrorCode.USER_INVALID_ERROR]: "用户验证失败,请检查用户名密码",
    [ClientErrorCode.USER_API_ERROR]: "用户接口错误",
    [ErrorCode.OrderBulkUpdateFailed]: "订单批量更新时发生内部错误",
    [ErrorCode.OrderCreateAssigneeFailed]: "订单操作中创建收货人存档时发生内部错误",
    [ErrorCode.OrderCreateProductFailed]: "订单操作中创建商品存档时发生内部错误",
    [ErrorCode.OrderDeleteFailed]: "订单删除时发生内部错误",
    [ErrorCode.OrderGetFailed]: "订单查询时发生内部错误",
    [ErrorCode.OrderListFailed]: "订单批量查询时发生内部错误",
    [ErrorCode.OrderUpdateFailed]: "订单更新时发生内部错误",
    [ErrorCode.UserAuthenticateFailed]: "认证用户时发生内部错误",
    [ErrorCode.UserBulkUpdateFailed]: "批量更新用户时发生内部错误",
    [ErrorCode.UserCreateFailed]: "创建用户时发生内部错误",
    [ErrorCode.UserDeleteFailed]: "删除用户时发生内部错误",
    [ErrorCode.UserGetFailed]: "查询用户时发生内部错误",
    [ErrorCode.UserListFailed]: "批量查询用户时发生内部错误",
    [ErrorCode.UserUpdateFailed]: "更新用户信息时发生内部错误",
    [ErrorCode.UnauthorizedRequest]:"用户无权进行此操作",
}

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