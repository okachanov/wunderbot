import { Module } from '@nestjs/common';
import { WunderbotDispatcherService } from './dispatcher.service';
import { WunderlistModule } from '../wunderlist/wunderlist.module';
import { EventEmitterModule } from '../ee/eventEmitter.module';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [WunderbotDispatcherService],
  imports: [WunderlistModule, EventEmitterModule, UsersModule],
})
export class WunderbotModule {}
