import { Consignee, ConsigneeAddress, TableHeader, ComputedColumn } from "../models/modelTypes";

export default class DataUtils {

  //filter all properties by keyword, return the list has one or more properties contains the keyword
  public static filterByKeyword(data: any[], keyword: string): any[] {
    let resultData = data;
    if (keyword && keyword.length > 0) {
      resultData = data.filter(function (v) {
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

  public static sort(data: any[], propertyName: string, desc: boolean): any[] {
    return data.sort((a, b) => {
      let propValueA = a[propertyName] ? a[propertyName] : "";
      let propValueB = b[propertyName] ? b[propertyName] : "";
      if (desc) {
        return (propValueB < propValueA ? -1 : (propValueB > propValueA ? 1 : 0));
      } else {
        return (propValueA < propValueB ? -1 : (propValueA > propValueB ? 1 : 0));
      }
    })
  }

  public static buildJWTAxiosData(token: string, data?: any) {
    return {
      headers: {
        'x-access-token': token,
      },
      body: data
    }
  }

  public static buildConsigneeAddressList(consignees: Consignee[]): ConsigneeAddress[] {
    let addressList = []
    addressList = consignees.reduce((addressList, consignee) => {
      return addressList.concat(consignee.consigneeAddresses.map((address) => {
        return {
          addressString: `${consignee.consigneeName}-${consignee.consigneePhone}-${address}`,
          consigneeName: consignee.consigneeName,
          consigneePhone: consignee.consigneePhone,
          consigneeAddress: address,
        } as ConsigneeAddress;
      }));
    }, addressList);
    return addressList;
  }

  public static buildExportData(rawData: any[], header: TableHeader) {
    let newData = rawData.map((row) => {
      let newRow = {};
      Object.keys(header).map((key, index) => {
        let headerText;
        let fieldValue = row[key];
        if (typeof header[key] === "object") {
          headerText = (header[key] as ComputedColumn).label;
          fieldValue = (header[key] as ComputedColumn).callback(fieldValue);
        } else {
          headerText = header[key] as string;
        }
        newRow[headerText] = fieldValue;
      });
      return newRow;
    });
    return newData;
  }
}