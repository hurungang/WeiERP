import { ClientErrorCode } from './enums'
import { plainToClass } from "class-transformer"
import { DataItem } from 'WekaServer/model/models'
import TextFormater from "../utils/textFormater";

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
export interface TableHeader{
  [name: string]: string|ComputedColumn, 
}
export interface ComputedColumn{
  label:string;
  callback:(value:string)=>string;
}
export interface Option{
  name:any;
  value:any;
}
export class TextPackage {
  applicationName: string;
  invoiceTitle: string;
  orderListTitle: string;
  currencyInfo: string;
  timeRangeFormat: TextFormater;
  paginator :{
    entriesPerPage: string;
    pageRange: TextFormater;
    entriesSelectArray: Option[];
  }
  orderHeader: TableHeader
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
    idColumn: string;
    defaultEntriesPerPage: number;
    bulkSend: string;
    bulkChangeStatus: string;
    statuses: {
      [status:string]:string;
    },
    changeStatusButtons: {
      [status:string]:string;
    },
    sendButtons: {
      newBatch:string;
      [button:string]:string;
    },
    emptyHeader: string;
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
    create: string; 
    bulkAction: string;
    refresh: string;
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
  };
  errorMessage:{
    [errorCode: string]:string
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
  errorCode: ClientErrorCode;
  errorDetail?: string;
}

export class Paginator {
  disableNext: boolean;
  disablePrevious: boolean;
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
      this.disablePrevious = (this.currentPage == 1);
      this.disableNext = (this.currentPage == this.totalPages);
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

export interface TableAction{
  bulkActions: {
    [actionName:string]:any;
  }[]
  createAction: any;
}
