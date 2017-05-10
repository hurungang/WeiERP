export enum HTTPStatusCode{
  OK=200,
  BadRequest=400,
  InternalServerError=500,
}

export enum MessageSectionCategory{
  Name,
  Address,
  Mobile,
  CommodityName,
  Quantity,
  Other
}


export enum ErrorCode{
  MessageMissingRequired,
  MessageMultipleValue,
  OrderAssembleFailed,
}

export enum StatusCode{
  Created,
}
