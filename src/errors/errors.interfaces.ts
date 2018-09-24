import {HttpStatus} from '@nestjs/common';

export interface IErrorMessage {
  type: AppErrorTypeEnum;
  httpStatus: HttpStatus;
  errorMessage: string;
  errorTextCode: string;
  userMessage: string;
}

export interface IErrorApiMessage {
  errorMessage: string;
  errorTextCode: string;
  userMessage: string;
  httpStatus: number;
}

export const enum AppErrorTypeEnum {
}
