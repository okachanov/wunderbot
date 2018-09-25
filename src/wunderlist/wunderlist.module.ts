import { Module } from '@nestjs/common';
import { WunderlistService } from './wunderlist.service';
import { WunderlistController } from './wunderlist.controller';
import { EventEmitterModule } from '../ee/eventEmitter.module';

@Module({
  providers: [WunderlistService],
  controllers: [WunderlistController],
  exports: [WunderlistService],
  imports: [EventEmitterModule],
})
export class WunderlistModule {}
