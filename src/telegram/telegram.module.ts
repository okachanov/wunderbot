import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { WunderlistModule } from '../wunderlist/wunderlist.module';

@Module({
  providers: [TelegramService],
  exports: [TelegramService],
  imports: [WunderlistModule],
})
export class TelegramModule {}
