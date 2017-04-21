import KeywordSearchUtil from './keywordSearchUtil'
import { MessageSectionCategory, ErrorCode } from '../model/enums'
import * as commonConfig from '../config/commonConfig'
import Logger from '../server/logger';

const logger = new Logger("MessageAnalyst");

export class MessageAnalyst {
  patterns: TextPattern[];
  validateResult: ValidateResult;
  result: MessageAnalysisResult;
  message: string;
  private regexSymbol = commonConfig.MESSAGE_ANALYST_CONFIG.REGEX_SPLITTER;
  
  constructor(message: string, patterns: TextPattern[]) {
    this.message = message;
    this.patterns = patterns;
    let messageSections: string[] = this.message.split(this.regexSymbol);
    this.result = new MessageAnalysisResult();
    for (var message of messageSections) {
      let messageSection: TextSection = new TextSection(message,patterns);
      this.result.add(messageSection);
    }
    this.validateResult = this.validate();
    logger.debug("MessageAnalyst constructed");
  }

  public validate():ValidateResult{
    let validateResult:ValidateResult = {result:true};
    for(let pattern of commonConfig.MESSAGE_ANALYST_CONFIG.ORDER_PATTERNS){
      let tempTextSection = this.result.getByCategory(pattern.category);
      if(pattern.required&&tempTextSection.length<1){
        validateResult.result = false;
        validateResult.errorCode = ErrorCode.MessageMissingRequired;
        validateResult.category = pattern.category;
        validateResult.textSections = tempTextSection;
        return validateResult;
      }
      if(!pattern.multiple&&tempTextSection.length>1){
        validateResult.result = false;
        validateResult.errorCode = ErrorCode.MessageMultipleValue;
        validateResult.category = pattern.category;
        validateResult.textSections = tempTextSection;
        return validateResult;
      }
    }
    return validateResult;
  }
}

export class MessageAnalysisResult {
  textSections: TextSection[];
  constructor() {
    this.textSections = [];
  }

  public add(textSection: TextSection) {
    this.textSections.push(textSection);
  }

  public get(index: number): TextSection {
    try {
      return this.textSections[index];
    } catch (ex) {
      return null;
    }
  }

  public getByCategory(category:MessageSectionCategory): TextSection[]{
    let categoryResult:TextSection[] = [];
    for(let section of this.textSections){
      if(section.category == category){
        categoryResult.push(section);
      }
    }
    return categoryResult;
  }

  public getFirstByCategory(category:MessageSectionCategory): TextSection{
    let tempResult = this.getByCategory(category);
    if(tempResult.length>0){
      return tempResult[0];
    }
  }
}
export class TextSection {
  patterns: TextPattern[];
  text: string;
  length: number;
  countEnglish: number;
  countChinese: number;
  countNumber: number;
  countSymbol: number;
  similarities: Similarity[];
  category: MessageSectionCategory;
  constructor(text: string, patterns: TextPattern[]) {
    this.text = text;
    this.patterns = patterns;
    this.length = this.count(commonConfig.MESSAGE_ANALYST_CONFIG.REGEX_MIXED);
    this.countEnglish = this.count(commonConfig.MESSAGE_ANALYST_CONFIG.REGEX_ENGLISH);
    this.countNumber = this.count(commonConfig.MESSAGE_ANALYST_CONFIG.REGEX_NUMBER);
    this.countChinese = this.count(commonConfig.MESSAGE_ANALYST_CONFIG.REGEX_CHINESE);
    this.countSymbol = this.count(commonConfig.MESSAGE_ANALYST_CONFIG.REGEX_SYMBOL);

    this.calcSimilarity();
  
    let highestSimilarity = this.getHighestSimilarity();
    if(highestSimilarity){
      this.category = highestSimilarity.category;
    }
  }
  
  public getSimilarity(category: MessageSectionCategory):Similarity {
    for (let similarity of this.similarities) {
      if (similarity.category == category) {
        return similarity;
      }
    }
  }
  
  public getHighestSimilarity():Similarity{
    let tempSimilarity = 0;
    let highestSimilarity:Similarity;
    for (let similarity of this.similarities) {
      if (similarity.similarity > tempSimilarity) {
        tempSimilarity = similarity.similarity;
        highestSimilarity = similarity;
      }
    }
    return highestSimilarity;
  }
  
  private count(regEx: RegExp): number {
    try {
      return this.text.match(regEx).length;
    } catch (ex) {
      return 0;
    }
  }

  private calcSimilarity() {
    this.similarities = [];
    for(let pattern of this.patterns){
      let similarity = 0;
      similarity = this.getRangeScore(this.countChinese, pattern.countChinese) +
        this.getRangeScore(this.countEnglish, pattern.countEnglish) +
        this.getRangeScore(this.countNumber, pattern.countNumber) +
        this.getRangeScore(this.countSymbol, pattern.countSymbol)+
        this.getKeywordScore(pattern.keywords);
      this.similarities.push({
        category: pattern.category,
        similarity: similarity
      });
    }
  }
  private getKeywordScore(keywords:string){
    let keywordSearch = new KeywordSearchUtil(this.text,keywords);
    return keywordSearch.getMatchCounts();
  }
  
  private getRangeScore(count: number, countRange: MatchPattern) {
    if (!countRange) {
      return 0;
    } else if (count >= countRange.lowerLength && count <= countRange.higherLength) {
      return 1;
    } else if (count < countRange.minimalLength) {
      return -1;
    } else if (count > countRange.maximalLength) {
      return -1;
    } else if (count >= countRange.minimalLength && count < countRange.lowerLength) {
      return (count - countRange.minimalLength) / (countRange.lowerLength - countRange.minimalLength)
    } else if (count <= countRange.maximalLength && count > countRange.higherLength) {
      return (countRange.maximalLength - count) / (countRange.maximalLength - countRange.higherLength)
    }
  }
}

export interface TextPattern {
  category: MessageSectionCategory;
  countEnglish: MatchPattern;
  countNumber: MatchPattern;
  countChinese: MatchPattern;
  countSymbol: MatchPattern;
  keywords: string;
  keywordsWeight: number;
  required: boolean;
  priority: number;
  multiple: boolean;
}

export interface MatchPattern {
  minimalLength: number;
  maximalLength: number;
  lowerLength: number;
  higherLength: number;
  weight:number;
}

export interface Similarity {
  category: MessageSectionCategory;
  similarity: number;
}


export interface ValidateResult {
  category?: MessageSectionCategory;
  result: boolean;
  textSections?: TextSection[]; 
  errorCode?: ErrorCode;
}