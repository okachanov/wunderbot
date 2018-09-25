import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { WunderlistModule } from '../wunderlist/wunderlist.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  providers: [TelegramService],
  exports: [TelegramService],
  imports: [TypeOrmModule.forFeature([User]), WunderlistModule],
})
export class TelegramModule {}
