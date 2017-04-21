import OrderAssembler from '../../util/orderAssembler'
import { MessageSectionCategory, ErrorCode } from '../../model/enums'
import * as commonConfig from '../../config/commonConfig'
import * as chai from 'chai'
import * as mocha from 'mocha'


describe("OrderAssembler Util", () => {

  describe("OrderAssembler", () => {
    it("construct with string", () => {
      let test: string = "test";
      let orderAssembler = new OrderAssembler(test);
      chai.assert.strictEqual(orderAssembler.order.rawMessage, test);
    })
    it("return no information if message is invalid", () => {
      let test: string = "测试，13551880577 四川省成都市温江区碧水新居12# 四川省成都市温江区碧水新居12#;Swiss男士综合维生素 2瓶 Swiss男士综合维生素 2瓶";
      let orderAssembler = new OrderAssembler(test);
      chai.assert.strictEqual(orderAssembler.order.rawMessage, test);
      chai.assert.strictEqual(orderAssembler.order.consigneeName, undefined);
    })
    it("find the right order information", () => {
      let test: string = "测试，13551880577 四川省成都市温江区碧水新居12#;Swiss男士综合维生素 2瓶";
      let orderAssembler = new OrderAssembler(test);
      chai.assert.strictEqual(orderAssembler.order.rawMessage, test);
      chai.assert.strictEqual(orderAssembler.order.consigneeName, "测试");
      chai.assert.strictEqual(orderAssembler.order.consigneeAddress, "四川省成都市温江区碧水新居12#");
      chai.assert.strictEqual(orderAssembler.order.consigneePhone, "13551880577");
    })
    it("assemble the right order item when there is only one commodity", () => {
      let test: string = "测试，13551880577 四川省成都市温江区碧水新居12#;Swiss男士综合维生素 2瓶";
      let orderAssembler = new OrderAssembler(test);
      chai.assert.strictEqual(orderAssembler.order.rawMessage, test);
      chai.assert.strictEqual(orderAssembler.order.consigneeName, "测试");
      chai.assert.strictEqual(orderAssembler.order.consigneeAddress, "四川省成都市温江区碧水新居12#");
      chai.assert.strictEqual(orderAssembler.order.consigneePhone, "13551880577");
      chai.assert.strictEqual(orderAssembler.order.orderItems.length, 1);
      chai.assert.strictEqual(orderAssembler.order.orderItems[0].productQuantity, 2);
      chai.assert.strictEqual(orderAssembler.order.orderItems[0].product.productName, "Swiss男士综合维生素");
    })
    it("assemble the right order item when there is multiple commodities", () => {
      let test: string = "测试，13551880577 四川省成都市温江区碧水新居12#;Swiss男士综合维生素 2瓶 Swiss男士综合维生素 2瓶";
      let orderAssembler = new OrderAssembler(test);
      chai.assert.strictEqual(orderAssembler.order.rawMessage, test);
      chai.assert.strictEqual(orderAssembler.order.consigneeName, "测试");
      chai.assert.strictEqual(orderAssembler.order.consigneeAddress, "四川省成都市温江区碧水新居12#");
      chai.assert.strictEqual(orderAssembler.order.consigneePhone, "13551880577");
      chai.assert.strictEqual(orderAssembler.order.orderItems.length, 2);
    })
    it("assemble the right order item when there is fixable mismatch of order item", () => {
      let test: string = "测试，13551880577 四川省成都市温江区碧水新居12#;Swiss男士综合维生素 2瓶 Swiss男士综合维生素";
      let orderAssembler = new OrderAssembler(test);
      chai.assert.strictEqual(orderAssembler.order.rawMessage, test);
      chai.assert.strictEqual(orderAssembler.order.consigneeName, "测试");
      chai.assert.strictEqual(orderAssembler.order.consigneeAddress, "四川省成都市温江区碧水新居12#");
      chai.assert.strictEqual(orderAssembler.order.consigneePhone, "13551880577");
      chai.assert.strictEqual(orderAssembler.order.orderItems.length, 2);
      chai.assert.strictEqual(orderAssembler.order.orderItems[1].productQuantity, 1);
      chai.assert.strictEqual(orderAssembler.order.orderItems[1].product.productName, "Swiss男士综合维生素");
    })
  })

}
)
