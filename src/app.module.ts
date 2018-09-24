import { config } from './config';
import { types } from 'pg';

import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { EventEmitterModule } from './ee/eventEmitter.module';
import { ConfigModule } from './config/config.module';
import { CacheModule } from './cache/cache.module';
import { WunderlistModule } from './wunderlist/wunderlist.module';
import { TelegramModule } from './telegram/telegram.module';

let cacheOptions;
if (config.get(`db.cache.enabled`)) {
  cacheOptions = {
    type: `redis`,
    options: {
      host: `localhost`,
      port: 6379,
    },
  };
} else {
  cacheOptions = true;
}

let connectionOptions: PostgresConnectionOptions;
if (config.get(`db.url`)){
  connectionOptions = {
    type: 'postgres',
    url: config.get(`db.url`),
    entities: [__dirname + '/**/**.entity.*'],
    migrations: ['migrations/*{.ts,.js}'],
    synchronize: true,
    cache: cacheOptions,
    migrationsRun: true,
  };
}else {
  connectionOptions = {
    type: 'postgres',
    host: config.get(`db.host`),
    port: config.get(`db.port`),
    username: config.get(`db.user`),
    password: config.get(`db.password`),
    database: config.get(`db.name`),
    entities: [__dirname + '/**/**.entity.*'],
    migrations: ['migrations/*{.ts,.js}'],
    synchronize: true,
    cache: cacheOptions,
    migrationsRun: true,
  };
}

@Module({
  imports: [
    TypeOrmModule.forRoot(connectionOptions),
    EventEmitterModule,
    ConfigModule,
    CacheModule,
    WunderlistModule,
    TelegramModule,
  ],
})
export class AppModule implements OnModuleInit {
  // noinspection JSUnusedLocalSymbols
  constructor(private readonly connection: Connection) {
    types.setTypeParser(1700, parseFloat);
  }

  onModuleInit() {
    if (process.send){
      process.send('ready');
      Logger.log('Sent `ready` signal to parent process', 'AppModule');
    }
    else Logger.log('app.module ready', 'AppModule');
  }
}
