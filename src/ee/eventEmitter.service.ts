import { Injectable, Logger } from '@nestjs/common';

import { EventEmitter } from 'events';
const Emitter = new EventEmitter();

@Injectable()
export class EventEmitterService {

  constructor(){
    Emitter.on('error', error => Logger.error(error));
  }

  on(event, callback){
    Emitter.on(event, callback);
  }

  emit(event: string, ...args: any[]){
    Emitter.emit(event, ...args);
  }

  removeListener(event, listener){
    Emitter.removeListener(event, listener);
  }

}
