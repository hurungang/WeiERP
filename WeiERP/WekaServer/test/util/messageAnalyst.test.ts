import { MessageAnalyst, TextSection } from '../../util/messageAnalyst'
import { MessageSectionCategory, ErrorCode } from '../../model/enums'
import * as commonConfig from '../../config/commonConfig'
import * as chai from 'chai'
import * as mocha from 'mocha'


describe("MessageAnalyst Util", () => {

  describe("MessageAnalyst", () => {
    it("construct with string", () => {
      let test: string = "test";
      let messageAnalyst = new MessageAnalyst(test,commonConfig.MESSAGE_ANALYST_CONFIG.ORDER_PATTERNS);
      chai.assert.strictEqual(messageAnalyst.message, test);
    })
    it("get right string sections with chinese symbol", () => {
      let test: string = "test，test2;aaa";
      let messageAnalyst = new MessageAnalyst(test,commonConfig.MESSAGE_ANALYST_CONFIG.ORDER_PATTERNS);
      chai.assert.strictEqual(messageAnalyst.result.rawTextSections.length, 3);
      chai.assert.strictEqual(messageAnalyst.result.rawTextSections[0].text, "test");
      chai.assert.strictEqual(messageAnalyst.result.rawTextSections[1].text, "test2");
      chai.assert.strictEqual(messageAnalyst.result.rawTextSections[2].text, "aaa");
    })
    it("get right string sections with space", () => {
      let test: string = "test test2";
      let messageAnalyst = new MessageAnalyst(test,commonConfig.MESSAGE_ANALYST_CONFIG.ORDER_PATTERNS);
      chai.assert.strictEqual(messageAnalyst.result.rawTextSections.length, 2);
      chai.assert.strictEqual(messageAnalyst.result.rawTextSections[0].text, "test");
    })
    it("get right string sections with space and mixed symbols", () => {
      let test: string = "test，test2;aaa bbb";
      let messageAnalyst = new MessageAnalyst(test,commonConfig.MESSAGE_ANALYST_CONFIG.ORDER_PATTERNS);
      chai.assert.strictEqual(messageAnalyst.result.rawTextSections.length, 4);
      chai.assert.strictEqual(messageAnalyst.result.rawTextSections[0].text, "test");
      chai.assert.strictEqual(messageAnalyst.result.rawTextSections[1].text, "test2");
      chai.assert.strictEqual(messageAnalyst.result.rawTextSections[2].text, "aaa");
      chai.assert.strictEqual(messageAnalyst.result.rawTextSections[3].text, "bbb");
    })
    it("get right chinese string sections with space and mixed symbols", () => {
      let test: string = "测试，测试2;Swiss男士综合维生素 2瓶";
      let messageAnalyst = new MessageAnalyst(test,commonConfig.MESSAGE_ANALYST_CONFIG.ORDER_PATTERNS);
      chai.assert.strictEqual(messageAnalyst.result.rawTextSections.length, 4);
      chai.assert.strictEqual(messageAnalyst.result.rawTextSections[0].text, "测试");
      chai.assert.strictEqual(messageAnalyst.result.rawTextSections[1].text, "测试2");
      chai.assert.strictEqual(messageAnalyst.result.rawTextSections[2].text, "Swiss男士综合维生素");
      chai.assert.strictEqual(messageAnalyst.result.rawTextSections[3].text, "2瓶");
    })
    
    it("validate false when missing address", () => {
      let test: string = "测试，测试2;Swiss男士综合维生素 2瓶";
      let messageAnalyst = new MessageAnalyst(test,commonConfig.MESSAGE_ANALYST_CONFIG.ORDER_PATTERNS);
      chai.assert.strictEqual(messageAnalyst.validateResult.result, false);
      chai.assert.strictEqual(messageAnalyst.validateResult.errorCode, ErrorCode.MessageMissingRequired);
      chai.assert.strictEqual(messageAnalyst.validateResult.category, MessageSectionCategory.Address);
    })
    
    it("validate true when everything in", () => {
      let test: string = "测试，13551880577 四川省成都市温江区碧水新居12#;Swiss男士综合维生素 2瓶";
      let messageAnalyst = new MessageAnalyst(test,commonConfig.MESSAGE_ANALYST_CONFIG.ORDER_PATTERNS);
      chai.assert.strictEqual(messageAnalyst.validateResult.result, true);
    })

    it("validate true when multiple commodities", () => {
      let test: string = "测试，13551880577 四川省成都市温江区碧水新居12#;Swiss男士综合维生素 2瓶 Swiss男士综合维生素 2瓶";
      let messageAnalyst = new MessageAnalyst(test,commonConfig.MESSAGE_ANALYST_CONFIG.ORDER_PATTERNS);
      chai.assert.strictEqual(messageAnalyst.validateResult.result, true);
    })
  })

  describe("TextSection", () => {
    it("construct with string", () => {
      let test: string = "test";
      let textSection = new TextSection(test,commonConfig.MESSAGE_ANALYST_CONFIG.ORDER_PATTERNS);
      chai.assert.strictEqual(textSection.text, test);
    })
    it("count English chars correctly", () => {
      let test: string = "test";
      let textSection = new TextSection(test,commonConfig.MESSAGE_ANALYST_CONFIG.ORDER_PATTERNS);
      chai.assert.strictEqual(textSection.countEnglish, 4);
    })
    it("count English and numerical chars correctly", () => {
      let test: string = "2345a2-d4";
      let textSection = new TextSection(test,commonConfig.MESSAGE_ANALYST_CONFIG.ORDER_PATTERNS);
      chai.assert.strictEqual(textSection.countEnglish, 2);
      chai.assert.strictEqual(textSection.countNumber, 6);
    })
    it("count English, Chinese and numerical chars correctly", () => {
      let test: string = "2345中国a2-d4";
      let textSection = new TextSection(test,commonConfig.MESSAGE_ANALYST_CONFIG.ORDER_PATTERNS);
      chai.assert.strictEqual(textSection.countEnglish, 2);
      chai.assert.strictEqual(textSection.countNumber, 6);
      chai.assert.strictEqual(textSection.countChinese, 2);
    })
    it("count total chars correctly", () => {
      let test: string = "2345中国a,，2{-d4";
      let textSection = new TextSection(test,commonConfig.MESSAGE_ANALYST_CONFIG.ORDER_PATTERNS);
      chai.assert.strictEqual(textSection.length, 14);
    })

    it("calc name similarity correctly", () => {
      let test: string = "胡润刚";
      let textSection = new TextSection(test,commonConfig.MESSAGE_ANALYST_CONFIG.ORDER_PATTERNS);
      chai.assert.equal(textSection.category, MessageSectionCategory.Name);
    })
    it("calc mobile similarity correctly", () => {
      let test: string = "13551880200";
      let textSection = new TextSection(test,commonConfig.MESSAGE_ANALYST_CONFIG.ORDER_PATTERNS);
      chai.assert.equal(textSection.category, MessageSectionCategory.Mobile);
    })
    it("calc commodity name similarity correctly", () => {
      let test: string = "Blackmoor袋鼠精";
      let textSection = new TextSection(test,commonConfig.MESSAGE_ANALYST_CONFIG.ORDER_PATTERNS);
      console.log(textSection.toString());
      chai.assert.equal(textSection.category, MessageSectionCategory.CommodityName);
    })
    it("calc commodity name similarity correctly", () => {
      let test: string = "Swiss男士综合维生素";
      let textSection = new TextSection(test,commonConfig.MESSAGE_ANALYST_CONFIG.ORDER_PATTERNS);
      chai.assert.equal(textSection.category, MessageSectionCategory.CommodityName);
    })
    it("calc address similarity correctly", () => {
      let test: string = "成都市温江区碧水新居12栋";
      let textSection = new TextSection(test,commonConfig.MESSAGE_ANALYST_CONFIG.ORDER_PATTERNS);
      chai.assert.equal(textSection.category, MessageSectionCategory.Address);
    })
  })
}
)
