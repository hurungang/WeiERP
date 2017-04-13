import { MessageAnalyst, TextSection } from '../../util/messageAnalyst'
import { MessageSectionCategory } from '../../model/enums'
import * as chai from 'chai'
import * as mocha from 'mocha'


describe("MessageAnalyst Util", () => {

  describe("MessageAnalyst", () => {
    it("construct with string", () => {
      let test: string = "test";
      let messageAnalyst = new MessageAnalyst(test);
      chai.assert.strictEqual(messageAnalyst.message, test);
    })
    it("get right string sections with chinese symbol", () => {
      let test: string = "test，test2;aaa";
      let messageAnalyst = new MessageAnalyst(test);
      chai.assert.strictEqual(messageAnalyst.result.textSections.length, 3);
      chai.assert.strictEqual(messageAnalyst.result.get(0).text, "test");
      chai.assert.strictEqual(messageAnalyst.result.get(1).text, "test2");
      chai.assert.strictEqual(messageAnalyst.result.get(2).text, "aaa");
    })
    it("get right string sections with space", () => {
      let test: string = "test test2";
      let messageAnalyst = new MessageAnalyst(test);
      chai.assert.strictEqual(messageAnalyst.result.textSections.length, 2);
      chai.assert.strictEqual(messageAnalyst.result.get(0).text, "test");
    })
    it("get right string sections with space and mixed symbols", () => {
      let test: string = "test，test2;aaa bbb";
      let messageAnalyst = new MessageAnalyst(test);
      chai.assert.strictEqual(messageAnalyst.result.textSections.length, 4);
      chai.assert.strictEqual(messageAnalyst.result.get(0).text, "test");
      chai.assert.strictEqual(messageAnalyst.result.get(1).text, "test2");
      chai.assert.strictEqual(messageAnalyst.result.get(2).text, "aaa");
      chai.assert.strictEqual(messageAnalyst.result.get(3).text, "bbb");
    })
    it("get right chinese string sections with space and mixed symbols", () => {
      let test: string = "测试，测试2;Swiss男士综合维生素 2瓶";
      let messageAnalyst = new MessageAnalyst(test);
      chai.assert.strictEqual(messageAnalyst.result.textSections.length, 4);
      chai.assert.strictEqual(messageAnalyst.result.get(0).text, "测试");
      chai.assert.strictEqual(messageAnalyst.result.get(1).text, "测试2");
      chai.assert.strictEqual(messageAnalyst.result.get(2).text, "Swiss男士综合维生素");
      chai.assert.strictEqual(messageAnalyst.result.get(3).text, "2瓶");
    })
  })

  describe("TextSection", () => {
    it("construct with string", () => {
      let test: string = "test";
      let textSection = new TextSection(test);
      chai.assert.strictEqual(textSection.text, test);
    })
    it("count English chars correctly", () => {
      let test: string = "test";
      let textSection = new TextSection(test);
      chai.assert.strictEqual(textSection.countEnglish, 4);
    })
    it("count English and numerical chars correctly", () => {
      let test: string = "2345a2-d4";
      let textSection = new TextSection(test);
      chai.assert.strictEqual(textSection.countEnglish, 2);
      chai.assert.strictEqual(textSection.countNumber, 6);
    })
    it("count English, Chinese and numerical chars correctly", () => {
      let test: string = "2345中国a2-d4";
      let textSection = new TextSection(test);
      chai.assert.strictEqual(textSection.countEnglish, 2);
      chai.assert.strictEqual(textSection.countNumber, 6);
      chai.assert.strictEqual(textSection.countChinese, 2);
    })
    it("count total chars correctly", () => {
      let test: string = "2345中国a,，2{-d4";
      let textSection = new TextSection(test);
      chai.assert.strictEqual(textSection.length, 14);
    })

    it("calc name similarity correctly", () => {
      let test: string = "胡润刚";
      let textSection = new TextSection(test);
      chai.assert.equal(textSection.getHighestSimilarity().category, MessageSectionCategory.Name);
    })
    it("calc mobile similarity correctly", () => {
      let test: string = "13551880200";
      let textSection = new TextSection(test);
      chai.assert.equal(textSection.getHighestSimilarity().category, MessageSectionCategory.Mobile);
    })
    it("calc commodity name similarity correctly", () => {
      let test: string = "Swiss男士综合维生素";
      let textSection = new TextSection(test);
      chai.assert.equal(textSection.getHighestSimilarity().category, MessageSectionCategory.CommodityName);
    })
    it("calc address similarity correctly", () => {
      let test: string = "成都市温江区碧水新居12栋";
      let textSection = new TextSection(test);
      chai.assert.equal(textSection.getHighestSimilarity().category, MessageSectionCategory.Address);
    })
  })
}
)
