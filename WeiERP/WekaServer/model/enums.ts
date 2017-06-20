export enum HTTPStatusCode{
  OK=200,
  BadRequest=400,
  InternalServerError=500,
  Unauthorized=401,
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
  OrderListFailed,
  OrderGetFailed,
  OrderCreateProductFailed,
  OrderUpdateFailed,
  OrderCreateAssigneeFailed,
  OrderBulkUpdateFailed,
  OrderDeleteFailed,
  ChatCreateUserFailed,
  ChatCreateProductFailed,
  ChatFindProductFailed,
  ChatSaveOrderFailed,
  UserCreateFailed,
  UserListFailed,
  UserAuthenticateFailed,
  UserGetFailed,
  UserUpdateFailed,
  UserBulkUpdateFailed,
  UserDeleteFailed,
}

export enum StatusCode{
  Created,
  Sent,
  Paid,
  Printed
}
