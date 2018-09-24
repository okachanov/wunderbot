import { Module } from '@nestjs/common';
import { EventEmitterService } from './eventEmitter.service';

@Module({
  providers: [EventEmitterService],
  exports: [EventEmitterService],
})

export class EventEmitterModule {}
