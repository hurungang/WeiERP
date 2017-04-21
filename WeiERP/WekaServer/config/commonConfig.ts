import { TextPattern } from '../util/messageAnalyst'
import { MessageSectionCategory } from '../model/enums'

export const APP_NAME = "Weka";
export const WELCOME_WORD = "Welcome to use Weka";
export const LOG_FILE_EXPRESS = "logs/log_express.log";
export const LOG_FILE = "logs/_app.log";
export const DATE_PATTERN = "yyyy_MM_dd";
export const ENV = "development" //change this to production when go live

export class MESSAGE_ANALYST_CONFIG {
  static REGEX_SPLITTER = /[ $-/:-?{-~!"^_`\[\]|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/
  static REGEX_MIXED = /[\u00ff-\uffff]|\S/g;
  static REGEX_ENGLISH = /([A-Za-z])/g;
  static REGEX_NUMBER = /([0-9])/g;
  static REGEX_CHINESE = /[\u4e00-\u9fff\uf900-\ufaff]/g;
  static REGEX_SYMBOL = /[$-/:-?{-~!"^_`\[\]|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g;
  static ORDER_PATTERNS: TextPattern[] = [{
    category: MessageSectionCategory.Name,
    countEnglish:   {minimalLength: 0,maximalLength: 0,lowerLength: 0,higherLength: 0, weight: 1,},
    countNumber:    {minimalLength: 0,maximalLength: 0,lowerLength: 0,higherLength: 0, weight: 1,},
    countChinese:   {minimalLength: 0,maximalLength: 5,lowerLength: 2,higherLength: 4, weight: 10,},
    countSymbol:    {minimalLength: 0,maximalLength: 0,lowerLength: 0,higherLength: 0, weight: 1,},
    keywords: "胡",
    keywordsWeight: 10,
    required: true,
    priority: 1,
    multiple: false,
  },{
    category: MessageSectionCategory.Address,
    countEnglish:   {minimalLength: 0,maximalLength: 0,lowerLength: 0,higherLength: 0, weight: 1,},
    countNumber:    {minimalLength: 0,maximalLength: 0,lowerLength: 0,higherLength: 0, weight: 1,},
    countChinese:   {minimalLength: 4,maximalLength: 40,lowerLength: 10,higherLength: 20, weight: 1,},
    countSymbol:    {minimalLength: 0,maximalLength: 0,lowerLength: 0,higherLength: 0, weight: 1,},
    keywords: "省;县;区;镇;街道;社区;村;组;路;小区;号;幢;单元;楼;栋",
    keywordsWeight: 20,
    required: true,
    priority: 1,
    multiple: false,
  },{
    category: MessageSectionCategory.CommodityName,
    countEnglish:   {minimalLength: 0,maximalLength: 0,lowerLength: 0,higherLength: 0, weight: 1,},
    countNumber:    {minimalLength: 0,maximalLength: 0,lowerLength: 0,higherLength: 0, weight: 1,},
    countChinese:   {minimalLength: 4,maximalLength: 40,lowerLength: 10,higherLength: 20, weight: 1,},
    countSymbol:    {minimalLength: 0,maximalLength: 0,lowerLength: 0,higherLength: 0, weight: 1,},
    keywords: "护肝片;维生素",
    keywordsWeight: 20,
    required: true,
    priority: 1,
    multiple: true,
  },{
    category: MessageSectionCategory.Mobile,
    countEnglish:   {minimalLength: 0,maximalLength: 0,lowerLength: 0,higherLength: 0, weight: 1,},
    countNumber:    {minimalLength: 8,maximalLength: 20,lowerLength: 8,higherLength: 13, weight: 20,},
    countChinese:   {minimalLength: 0,maximalLength: 0,lowerLength: 0,higherLength: 0, weight: 1,},
    countSymbol:    {minimalLength: 0,maximalLength: 3,lowerLength: 0,higherLength: 1, weight: 1,},
    keywords: "",
    keywordsWeight: 0,
    required: true,
    priority: 1,
    multiple: true,
  },{
    category: MessageSectionCategory.Quantity,
    countEnglish:   {minimalLength: 0,maximalLength: 0,lowerLength: 0,higherLength: 0, weight: 1,},
    countNumber:    {minimalLength: 0,maximalLength: 3,lowerLength: 1,higherLength: 2, weight: 10,},
    countChinese:   {minimalLength: 0,maximalLength: 2,lowerLength: 0,higherLength: 2, weight: 10,},
    countSymbol:    {minimalLength: 0,maximalLength: 3,lowerLength: 0,higherLength: 1, weight: 1,},
    keywords: "瓶;盒;箱;件;个;只;罐;条;袋;支;管",
    keywordsWeight: 10,
    required: true,
    priority: 1,
    multiple: true,
  },
  ]
  
  static getOrderPattern(category:MessageSectionCategory):TextPattern{
    for(let pattern of MESSAGE_ANALYST_CONFIG.ORDER_PATTERNS){
      if(pattern.category == category){
        return pattern;
      }
    }
    return null;
  }
}