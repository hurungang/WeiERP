import { Order, OrderItem, Product } from '../model/models'
import { MessageAnalyst, MessageAnalysisResult } from "./messageAnalyst";
import { MessageSectionCategory, StatusCode } from '../model/enums'
import * as commonConfig from '../config/commonConfig'
import Logger from "../server/logger";

const logger = new Logger("OrderAssembler");

export default class OrderAssembler {
    successful: boolean;
    order: Order;
    messageAnalyst: MessageAnalyst;

    constructor(orderText: string) {
        this.order = new Order();
        this.successful = true;
        this.order.rawMessage = orderText;
        this.order.status = StatusCode[StatusCode.Created];
        let patterns = commonConfig.MESSAGE_ANALYST_CONFIG.ORDER_PATTERNS;
        this.messageAnalyst = new MessageAnalyst(orderText, patterns);
        if (this.messageAnalyst.validateResult.result) {
            this.order.consigneeName = this.getTextByCategory(this.messageAnalyst.result, MessageSectionCategory.Name);
            this.order.consigneeAddress = this.getTextByCategory(this.messageAnalyst.result, MessageSectionCategory.Address);
            this.order.consigneePhone = this.getTextByCategory(this.messageAnalyst.result, MessageSectionCategory.Mobile);
            this.order.orderItems = this.getOrderItems(this.messageAnalyst.result);
            this.successful = true;
        }
        logger.debug("OrderAssembler constructed");
    }

    private getTextByCategory(result: MessageAnalysisResult, category: MessageSectionCategory) {
        let categoryResult = result.getByCategory(category);
        let tempResultText = "";
        for (let tempResult of categoryResult) {
            tempResultText += tempResult.text;
        }
        return tempResultText;
    }

    private getOrderItems(result: MessageAnalysisResult) {
        let commodities = result.getByCategory(MessageSectionCategory.CommodityName);
        let commodityQuantities = result.getByCategory(MessageSectionCategory.Quantity);
        let commodityNameAndQuantities = result.getByCategory(MessageSectionCategory.CommodityNameAndQuantity);
        let tempOrderItems = [];
        for (let nameAndQuantity of commodityNameAndQuantities) {
            let quantityRegex = commonConfig.MESSAGE_ANALYST_CONFIG.REGEX_QUANTITY;
            let matches = nameAndQuantity.text.match(quantityRegex);
            if (matches && matches[0]) {
                let quantityText = nameAndQuantity.text.substr(nameAndQuantity.text.lastIndexOf(matches[0]));
                let nameText = nameAndQuantity.text.substr(0, nameAndQuantity.text.lastIndexOf(matches[0]));
                let tempQuantity = parseInt(quantityText);
                let tempOrderItem: OrderItem = new OrderItem();
                let tempProduct: Product = new Product();
                tempProduct.productName = nameText;
                tempOrderItem.product = tempProduct;
                tempOrderItem.productQuantity = tempQuantity;
                tempOrderItems.push(tempOrderItem);
            }
        }
        for (let i = 0; i < commodities.length; i++) {
            let tempProduct: Product = new Product();
            tempProduct.productName = commodities[i].text;
            let tempQuantity = 1;
            for (let commodityQuantity of commodityQuantities) {
                if (commodityQuantity.index == commodities[i].index + 1) {
                    tempQuantity = parseInt(commodityQuantity.text);
                }
            }
            let tempOrderItem: OrderItem = new OrderItem();
            tempOrderItem.product = tempProduct;
            tempOrderItem.productQuantity = tempQuantity;
            tempOrderItems.push(tempOrderItem);
        }
        return tempOrderItems;
    }
}
