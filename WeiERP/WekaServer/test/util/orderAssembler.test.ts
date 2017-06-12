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
    it("assemble the right order item when there is only one commodity and commodity do not match any existing keyword", () => {
      let test: string = "测试，13551880577 四川省成都市温江区碧水新居12#;Blackmoor袋鼠精 2瓶";
      let orderAssembler = new OrderAssembler(test);
      chai.assert.strictEqual(orderAssembler.order.rawMessage, test);
      chai.assert.strictEqual(orderAssembler.order.consigneeName, "测试");
      chai.assert.strictEqual(orderAssembler.order.consigneeAddress, "四川省成都市温江区碧水新居12#");
      chai.assert.strictEqual(orderAssembler.order.consigneePhone, "13551880577");
      chai.assert.strictEqual(orderAssembler.order.orderItems.length, 1);
      chai.assert.strictEqual(orderAssembler.order.orderItems[0].productQuantity, 2);
      chai.assert.strictEqual(orderAssembler.order.orderItems[0].product.productName, "Blackmoor袋鼠精");
    })
    it("assemble the right order item when there is only one commodity and commodity do not match any existing keyword and address at end", () => {
      let test: string = "测试，13551880577 ;Blackmoor袋鼠精 2瓶 四川省成都市温江区碧水新居12";
      let orderAssembler = new OrderAssembler(test);
      chai.assert.strictEqual(orderAssembler.order.rawMessage, test);
      chai.assert.strictEqual(orderAssembler.order.consigneeName, "测试");
      chai.assert.strictEqual(orderAssembler.order.consigneeAddress, "四川省成都市温江区碧水新居12");
      chai.assert.strictEqual(orderAssembler.order.consigneePhone, "13551880577");
      chai.assert.strictEqual(orderAssembler.order.orderItems.length, 1);
      chai.assert.strictEqual(orderAssembler.order.orderItems[0].productQuantity, 2);
      chai.assert.strictEqual(orderAssembler.order.orderItems[0].product.productName, "Blackmoor袋鼠精");
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
    it("assemble the right order item when commodity name is very short", () => {
      let test: string = "测试，13551880577 四川省成都市温江区碧水新居12#;VC泡腾片 2瓶";
      let orderAssembler = new OrderAssembler(test);
      chai.assert.strictEqual(orderAssembler.order.rawMessage, test);
      chai.assert.strictEqual(orderAssembler.order.consigneeName, "测试");
      chai.assert.strictEqual(orderAssembler.order.consigneeAddress, "四川省成都市温江区碧水新居12#");
      chai.assert.strictEqual(orderAssembler.order.consigneePhone, "13551880577");
      chai.assert.strictEqual(orderAssembler.order.orderItems.length, 1);
      chai.assert.strictEqual(orderAssembler.order.orderItems[0].productQuantity, 2);
      chai.assert.strictEqual(orderAssembler.order.orderItems[0].product.productName, "VC泡腾片");
    })
    it("assemble the right order item when there is extra words in, take as commodity name", () => {
      let test: string = "李四，13551880577 乱入 四川省成都市温江区碧水新居12#;VC泡腾片 2瓶";
      let orderAssembler = new OrderAssembler(test);
      console.log(orderAssembler.order.toString());
      chai.assert.strictEqual(orderAssembler.order.rawMessage, test);
      chai.assert.strictEqual(orderAssembler.order.consigneeName, "李四");
      chai.assert.strictEqual(orderAssembler.order.consigneeAddress, "四川省成都市温江区碧水新居12#");
      chai.assert.strictEqual(orderAssembler.order.consigneePhone, "13551880577");
      chai.assert.strictEqual(orderAssembler.order.orderItems.length, 2);
      chai.assert.strictEqual(orderAssembler.order.orderItems[0].productQuantity, 1);
      chai.assert.strictEqual(orderAssembler.order.orderItems[0].product.productName, "乱入");
    })
    it("assemble the right order item when there is leading words for name", () => {
      let test: string = "姓名李四，13551880577 乱入 四川省成都市温江区碧水新居12#;VC泡腾片 2瓶";
      let orderAssembler = new OrderAssembler(test);
      chai.assert.strictEqual(orderAssembler.order.rawMessage, test);
      chai.assert.strictEqual(orderAssembler.order.consigneeName, "李四");
    })
    it("assemble the right order item when there is leading words for name with notation", () => {
      let test: string = "姓名:李四，13551880577 乱入 四川省成都市温江区碧水新居12#;VC泡腾片 2瓶";
      let orderAssembler = new OrderAssembler(test);
      chai.assert.strictEqual(orderAssembler.order.rawMessage, test);
      chai.assert.strictEqual(orderAssembler.order.consigneeName, "李四");
    })
    it("assemble the right order item when there is leading words for name with notation", () => {
      let test: string = "姓名:李四，电话号码13551880577 乱入 地址是四川省成都市温江区碧水新居12#;VC泡腾片 要2瓶";
      let orderAssembler = new OrderAssembler(test);
      chai.assert.strictEqual(orderAssembler.order.rawMessage, test);
      chai.assert.strictEqual(orderAssembler.order.consigneeName, "李四");
      chai.assert.strictEqual(orderAssembler.order.consigneePhone, "13551880577");
      chai.assert.strictEqual(orderAssembler.order.orderItems.length, 2);
      chai.assert.strictEqual(orderAssembler.order.orderItems[1].productQuantity, 2);
      chai.assert.strictEqual(orderAssembler.order.orderItems[1].product.productName, "VC泡腾片");
      chai.assert.strictEqual(orderAssembler.order.consigneeAddress, "四川省成都市温江区碧水新居12#");
    })
    it.only("assemble the right order item when there is leading words for name with notation 2", () => {
      let test: string = "VC泡腾 3 成都市温江区鱼凫路339号静水香榭 姓名：杨冰洁。     电话13551320222";
      let orderAssembler = new OrderAssembler(test);
      //console.log(orderAssembler.messageAnalyst.result.rawTextSections);
      chai.assert.strictEqual(orderAssembler.order.rawMessage, test);
      chai.assert.strictEqual(orderAssembler.order.consigneeName, "杨冰洁");
      chai.assert.strictEqual(orderAssembler.order.consigneePhone, "13551320222");
      chai.assert.strictEqual(orderAssembler.order.orderItems.length, 1);
      chai.assert.strictEqual(orderAssembler.order.orderItems[0].productQuantity, 3);
      chai.assert.strictEqual(orderAssembler.order.orderItems[0].product.productName, "VC泡腾");
      chai.assert.strictEqual(orderAssembler.order.consigneeAddress, "成都市温江区鱼凫路339号静水香榭");
    })
  })

}
)
