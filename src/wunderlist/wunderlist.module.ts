import { Module } from '@nestjs/common';
import { WunderlistService } from './wunderlist.service';
import { WunderlistController } from './wunderlist.controller';

@Module({
  providers: [WunderlistService],
  controllers: [WunderlistController],
  exports: [WunderlistService],
})
export class WunderlistModule {}
