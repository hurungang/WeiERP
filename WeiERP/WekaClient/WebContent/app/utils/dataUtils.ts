export default class DataUtils{

  //filter all properties by keyword, return the list has one or more properties contains the keyword
  public static filterByKeyword(data:any[],keyword: string): any[] {
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

  public static sort(data:any[], propertyName:string, desc:boolean):any[]{
    return data.sort((a,b)=>{
      let propValueA = a[propertyName]?a[propertyName]:"";
      let propValueB = b[propertyName]?b[propertyName]:"";
      if(desc){
        return (propValueB<propValueA?-1:(propValueB>propValueA?1:0));
      }else{
        return (propValueA<propValueB?-1:(propValueA>propValueB?1:0));
      }
    })
  }
}