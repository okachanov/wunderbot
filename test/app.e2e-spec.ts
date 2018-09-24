import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { DispatchError } from '../src/errors/errors.dispatcher';

jest.setTimeout(25000);

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({imports: [AppModule]}).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new DispatchError());
    await app.init();

  });

});
