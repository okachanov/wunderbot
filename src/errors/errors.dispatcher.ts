import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AppError } from './app.error';
import { IErrorApiMessage } from './errors.interfaces';

@Catch()
export class DispatchError implements ExceptionFilter {

  catch(exception: any, host: ArgumentsHost): any {

    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    const jsonResponse: IErrorApiMessage = this.getJsonForResponse(exception);
    return res.status(jsonResponse.httpStatus).json(jsonResponse);

  }

  private getJsonForResponse(exception): IErrorApiMessage {

    if (exception instanceof AppError) {
      return {
        errorTextCode: exception.errorTextCode,
        errorMessage: exception.errorMessage,
        userMessage: exception.userMessage,
        httpStatus: exception.httpStatus,
      };
    }

    if (exception instanceof UnauthorizedException) {
      return {
        errorMessage: exception.message,
        errorTextCode: 'Unauthorized',
        userMessage: 'Unauthorized',
        httpStatus: HttpStatus.UNAUTHORIZED,
      };
    }

    if (exception.status === 403) {
      return {
        errorMessage: exception.message,
        errorTextCode: 'Forbidden',
        userMessage: 'Forbidden',
        httpStatus: HttpStatus.FORBIDDEN,
      };
    }

    if (exception instanceof BadRequestException) {
      return {
        errorMessage: exception.message.error,
        errorTextCode: 'BadRequest',
        userMessage: exception.message.message,
        httpStatus: exception.getStatus(),
      };
    }

    /* tslint:disable:no-console */
    console.dir(exception.message);
    console.dir(exception.stack);

    return {
      errorMessage: exception.message.error,
      errorTextCode: 'InternalServerError',
      userMessage: exception.message.message,
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    };

  }
}
