import { Module } from '@nestjs/common';
import { WunderbotDispatcherService } from './dispatcher.service';
import { WunderlistModule } from '../wunderlist/wunderlist.module';

@Module({
  providers: [WunderbotDispatcherService],
  imports: [WunderlistModule],
})
export class WunderbotModule {}
