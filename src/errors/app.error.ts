import { AppErrorTypeEnum, IErrorMessage } from './errors.interfaces';

import { ErrorsLoader } from './errors.loader';
const Loader = new ErrorsLoader();

export class AppError extends Error {

  public errorCode: AppErrorTypeEnum;
  public httpStatus: number;
  public errorTextCode: string;
  public errorMessage: string;
  public userMessage: string;

  constructor(errorCode: AppErrorTypeEnum) {

    super();

    const errorMessageConfig: IErrorMessage = Loader.getError(errorCode);
    if (!errorMessageConfig) throw new Error('Unable to find message code error.');

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.httpStatus = errorMessageConfig.httpStatus;
    this.errorCode = errorCode;
    this.errorTextCode = errorMessageConfig.errorTextCode;
    this.errorMessage = errorMessageConfig.errorMessage;
    this.userMessage = errorMessageConfig.userMessage;

  }

}
