import { Global, Module } from '@nestjs/common';
import { config } from '../config';

const configProvider = {
  provide: 'ConfigProvider',
  useValue: config,
};

@Global()
@Module({
  providers: [configProvider],
  exports: [configProvider],
})
export class ConfigModule {}
