import { Status } from './enums'
import { plainToClass } from "class-transformer"
import { DataItem } from 'WekaServer/model/models'

export { Order, OrderItem, Product, User, DataItem } from 'WekaServer/model/models'

export class Localization {
    defaultLanguage:string;
    languages:Language[];
    constructor(defaultLanguage:string){
      this.defaultLanguage = defaultLanguage;
      this.languages = [];
    }

    addLanguage(language:Language){
      this.languages.push(language);
    }

    getLanguage(languageName:string):Language{
      for(let language of this.languages){
        if(language.languageName===languageName){
          return language;
        }
      }
      return null;
    }
}

export class Language {
  languageName: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  textPackage: TextPackage;
  constructor(languageName){
    this.languageName = languageName;
    this.textPackage = new TextPackage();
  }
}

export class TextPackage {
  applicationName: string;
  invoiceTitle: string;
  orderListTitle: string;
  currencyInfo: string;
  order:{
    id: string;
    user: string;
    consigneeName: string;
    consigneeAddress: string;
    consigneePhone: string;
    senderName: string;
    senderAddress: string;
    senderPhone: string;
    createTime: string;
    tax: string;
    shipping: string;
    paid: string;
    paidTime: string;
    status: string;
    rawMessage: string;
    orderItems: string;
    comments: string;
    subtotal: string;
    total: string;
  };
  orderItem:{
    id: string;
    product: string;
    productQuantity: string;
    productCost: string;
    productOrderPrice: string;
    subtotal: string;
  };
  product:{
    id: string;
    user: string;
    productName: string;
    productSN: string;
    productSummary: string;
    productDetail: string;
    productPrice: string;
    productUnit: string;
    createTime: string;
  };
  button:{
    save: string;
    delete: string;
    update: string;
    print: string;
  };
  timeRangePicker:{
      format: string,
      separator: string,
      applyLabel: string,
      cancelLabel: string,
      weekLabel: string,
      customRangeLabel: string,
      daysOfWeek: string[],
      monthNames: string[],
      firstDay: number,
  }
}

export class Config {
  runtime: Runtime;
  localization: Localization;
  getLanguage(languageName:string):Language{
    return this.localization.getLanguage(languageName);
  }
}

export interface Runtime {
  mode: string; 
  api: {
    order: string,
    user: string,
  }
}

export interface Menu {
  id: number;
  text: string;
  link: string;
  icon: string;
  subMenus?: Menu[];
}


export class Error {
  errorCode: string;
  errorDetail?: string;
}

export class Paginator {
  end: number;
  start: number;
  slice: any[];
  currentPage: number = 1;
  entriesPerPage: number = 10;
  totalRecords: number=0;
  totalPages: number=0;
  list: any;
  constructor(currentPage: number, entriesPerPage: number) {
    this.currentPage = currentPage;
    this.entriesPerPage = entriesPerPage;
  }

  init(list:any[]){
    this.list=list;
    if(this.list){
      this.totalRecords = this.list.length;
      this.totalPages = Math.ceil(this.totalRecords/this.entriesPerPage);
      this.start = (this.currentPage-1)*this.entriesPerPage + 1;
      this.end = this.currentPage*this.entriesPerPage;
      this.slice = list.slice((this.currentPage-1)*this.entriesPerPage,(this.currentPage)*this.entriesPerPage);
    }
  }

  map(func:(index:number)=>any){
    let funcArray = [];
    for(let i=1;i<=this.totalPages;i++){
        funcArray.push(func(i));
    }
    return funcArray;
  }
}

export class DataList<T extends DataItem>{
  data: T[];
  constructor(prototype: { new (): T; }, data) {
    this.data = plainToClass(prototype, data);
  }

  //filter all properties by keyword, return the list has one or more properties contains the keyword
  public filter(keyword: string): T[] {
    let resultData = this.data;
    if (keyword && keyword.length > 0) {
      resultData = this.data.filter(function (v) {
        return Object.keys(v).some(function (k) {
          if (v[k]) {
            return v[k].toString().indexOf(keyword) > -1;
          } else {
            return false;
          }
        })
      }
      )
    }
    return resultData;
  }
  public sort(propertyName:string, desc:boolean){
    this.data = this.data.sort((a,b)=>{
      let propValueA = a[propertyName]?a[propertyName]:"";
      let propValueB = b[propertyName]?b[propertyName]:"";
      if(desc){
        return (propValueB<propValueA?-1:(propValueB>propValueA?1:0));
      }else{
        return (propValueA<propValueB?-1:(propValueA>propValueB?1:0));
      }
    })
  }
  // add or replace, return index of replacing, or -1 for adding
  public addOrReplace(item:T): number {
    let result = -1;
    this.data = this.data.map((tempItem,index)=>{
      if(tempItem.equals(item)){
        result = index;
        return item;
      }else{
        return tempItem;
      }
    })
    if(result==-1){
      this.data.push(item);
    }
    return result;
  }
}

