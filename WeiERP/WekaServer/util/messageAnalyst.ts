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
      if(message.trim()!=""){
        let messageSection: TextSection = new TextSection(message,patterns);
        this.result.add(messageSection);
      }
    }
    this.validateResult = this.validate();
    logger.debug("MessageAnalyst constructed:"+this.result);
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
  rawTextSections: TextSection[];
  constructor() {
    this.textSections = [];
    this.rawTextSections = [];
  }

  public add(textSection: TextSection, isRaw=true) {
    if(isRaw){
      textSection.index = this.rawTextSections.length;
      this.rawTextSections.push(textSection);
    }
    let pattern = commonConfig.MESSAGE_ANALYST_CONFIG.getOrderPattern(textSection.category);
    if(pattern.multiple){
      this.textSections.push(textSection);
    }else{
      let pendingAddTextSection = textSection;
      let categoryExisted = false;
      for(let i=0;i<this.textSections.length;i++){
        let savedTextSection = this.textSections[i];
        if(savedTextSection.category == textSection.category && !savedTextSection.isPrefix){
          categoryExisted = true;
          if(savedTextSection.similarity<textSection.similarity){
            pendingAddTextSection = savedTextSection;
            this.textSections[i] = textSection;
          }
        }
      }
      if(!categoryExisted){
        this.textSections.push(pendingAddTextSection);
      }else if(pendingAddTextSection.nextPossibleCategory()){
        this.add(pendingAddTextSection,false);
      }
    }
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
      if(section.category == category && !section.isPrefix){
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

  public toString(){
    let resultString = "";
    for(let textSection of this.textSections){
      resultString += textSection+"\n";
    }
    return resultString;
  }
}
export class TextSection {
  //patterns: TextPattern[];
  index: number;
  text: string;
  length: number;
  countEnglish: number;
  countChinese: number;
  countNumber: number;
  countSymbol: number;
  similarities: Similarity[];
  category: MessageSectionCategory;
  similarity: number;
  isPrefix: boolean;
  constructor(text: string, patterns: TextPattern[]) {
    this.text = text;
    //this.patterns = patterns;
    this.category = null;
    this.length = this.count(commonConfig.MESSAGE_ANALYST_CONFIG.REGEX_MIXED);
    this.countEnglish = this.count(commonConfig.MESSAGE_ANALYST_CONFIG.REGEX_ENGLISH);
    this.countNumber = this.count(commonConfig.MESSAGE_ANALYST_CONFIG.REGEX_NUMBER);
    this.countChinese = this.count(commonConfig.MESSAGE_ANALYST_CONFIG.REGEX_CHINESE);
    this.countSymbol = this.count(commonConfig.MESSAGE_ANALYST_CONFIG.REGEX_SYMBOL);

    this.calcSimilarity(patterns);
    this.nextPossibleCategory();
  }

  public nextPossibleCategory():boolean{
    //get next most possible category compare to current category
    let hasNextCategory = false;
    for(let i=0;i<this.similarities.length;i++){
      let tempCategory = this.similarities[i].category;
      let tempSimilarity = this.similarities[i].similarity;
      if(this.category==null){
        this.category = tempCategory;
        this.similarity = tempSimilarity;
        hasNextCategory = true;
        break;
      }else if(this.category==tempCategory&&(i+1)<this.similarities.length){
        this.category = this.similarities[i+1].category;
        this.similarity = this.similarities[i+1].similarity;
        hasNextCategory = true;
        break;
      }
    }
    return hasNextCategory;
  }
  
  public getSimilarity(category: MessageSectionCategory):Similarity {
    for (let similarity of this.similarities) {
      if (similarity.category == category) {
        return similarity;
      }
    }
  }
  
  private count(regEx: RegExp): number {
    try {
      return this.text.match(regEx).length;
    } catch (ex) {
      return 0;
    }
  }

  private calcSimilarity(patterns:TextPattern[]) {
    this.similarities = [];
    for(let pattern of patterns){
      let similarity = 0;
      
      let totalWeight = pattern.countChinese.weight + pattern.countEnglish.weight + pattern.countNumber.weight + pattern.countSymbol.weight + pattern.keywordsWeight;


      let matches = this.text.match(pattern.prefix);
      let trimedText = this.text;
      if(matches&&matches[0]){
        console.log(matches);
        similarity = pattern.prefixWeight;
        trimedText = this.text.substr(this.text.lastIndexOf(matches[0])+matches[0].length);
      }
      if(trimedText&&trimedText.trim().length>0){
        this.text = trimedText;
        similarity = similarity + 
          this.getRangeScore(this.countChinese, pattern.countChinese)*pattern.countChinese.weight/totalWeight +
          this.getRangeScore(this.countEnglish, pattern.countEnglish)*pattern.countEnglish.weight/totalWeight +
          this.getRangeScore(this.countNumber, pattern.countNumber)*pattern.countNumber.weight/totalWeight +
          this.getRangeScore(this.countSymbol, pattern.countSymbol)*pattern.countSymbol.weight/totalWeight +
          this.getKeywordScore(pattern.keywords)*pattern.keywordsWeight/totalWeight;
      }else{
        this.isPrefix = true;
      }
      this.similarities.push({
        category: pattern.category,
        similarity: similarity
      });
      this.similarities.sort((a,b)=>{
        //from high to low
        return b.similarity - a.similarity;
      })
    }
  }
  private getKeywordScore(keywords:RegExp|string){
    if(keywords==null){
      return 0;
    }else if(keywords instanceof  RegExp){
      return keywords.test(this.text)?1:0;
    }else{
      let keywordSearch = new KeywordSearchUtil(this.text,keywords);
      return keywordSearch.getMatchCounts();
    }
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

  public toString(){
    let resultString = "{category:"+MessageSectionCategory[this.category]+",text:"+this.text+",isPrefix:"+this.isPrefix+",similarities:[";
    for(let tempSimilarity of this.similarities){
      resultString += "{category:"+MessageSectionCategory[tempSimilarity.category]+",similarity:"+tempSimilarity.similarity+"}";
    }
    resultString += "]}";
    return resultString;
  }
}

export interface TextPattern {
  prefix: RegExp;
  prefixWeight: number,
  category: MessageSectionCategory;
  countEnglish: MatchPattern;
  countNumber: MatchPattern;
  countChinese: MatchPattern;
  countSymbol: MatchPattern;
  keywords: RegExp|string;
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