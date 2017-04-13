import KeywordSearchUtil from './keywordSearchUtil'
import { MessageSectionCategory } from '../model/enums'
import * as commonConfig from '../config/commonConfig'
import Logger from '../server/logger';

const logger = new Logger("MessageAnalyst");

export class MessageAnalyst {
  result: MessageAnalysisResult;
  message: string;
  private regexSymbol = commonConfig.MESSAGE_ANALYST_CONFIG.REGEX_SPLITTER;
  constructor(message: string) {
    this.message = message;
    let messageSections: string[] = this.message.split(this.regexSymbol);
    this.result = new MessageAnalysisResult();
    for (var message of messageSections) {
      let messageSection: TextSection = new TextSection(message);
      this.result.add(messageSection);
    }
    logger.debug("MessageAnalyst constructed");
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
}
export class TextSection {
  text: string;
  position: number;
  length: number;
  countEnglish: number;
  countChinese: number;
  countNumber: number;
  countSymbol: number;
  similarities: Similarity[];
  category: MessageSectionCategory;
  constructor(text: string) {
    this.text = text;
    this.similarities = [];
    this.length = this.count(commonConfig.MESSAGE_ANALYST_CONFIG.REGEX_MIXED);
    this.countEnglish = this.count(commonConfig.MESSAGE_ANALYST_CONFIG.REGEX_ENGLISH);
    this.countNumber = this.count(commonConfig.MESSAGE_ANALYST_CONFIG.REGEX_NUMBER);
    this.countChinese = this.count(commonConfig.MESSAGE_ANALYST_CONFIG.REGEX_CHINESE);
    this.countSymbol = this.count(commonConfig.MESSAGE_ANALYST_CONFIG.REGEX_SYMBOL);

    this.similarities.push(this.calcSimilarity(MessageSectionCategory.Name));
    this.similarities.push(this.calcSimilarity(MessageSectionCategory.Mobile));
    this.similarities.push(this.calcSimilarity(MessageSectionCategory.Address));
    this.similarities.push(this.calcSimilarity(MessageSectionCategory.CommodityName));
    this.similarities.push(this.calcSimilarity(MessageSectionCategory.Quantity));
  
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

  private calcSimilarity(category: MessageSectionCategory): Similarity {
    let similarity = 0;
    let pattern = commonConfig.MESSAGE_ANALYST_CONFIG.getPattern(category);

    similarity = this.getRangeScore(this.countChinese, pattern.countChinese) +
      this.getRangeScore(this.countEnglish, pattern.countEnglish) +
      this.getRangeScore(this.countNumber, pattern.countNumber) +
      this.getRangeScore(this.countSymbol, pattern.countSymbol)+
      this.getKeywordScore(pattern.keywords);
    return {
      category: category,
      similarity: similarity
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