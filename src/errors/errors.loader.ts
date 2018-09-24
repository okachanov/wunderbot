import * as glob from 'glob';
import * as path from 'path';

import { AppErrorTypeEnum, IErrorMessage } from './errors.interfaces';

export class ErrorsLoader {

  private errors = new Map();

  constructor() {
    const errorsPartialsFilesList: string[] = glob.sync(path.resolve(__dirname) + `/../*/*errors.?s`);

    errorsPartialsFilesList.forEach(partialPath => {
      const errorsList: IErrorMessage[] = require(partialPath).default || [];
      errorsList.forEach(error => this.errors.set(error.type, error));
    });
  }

  public getError(errorCode: AppErrorTypeEnum): IErrorMessage {
    return this.errors.get(errorCode);
  }

}
