import { Test, TestingModule } from '@nestjs/testing';
import { TelegramService } from '../telegram.service';

describe('Telegram module', () => {
  let service: TelegramService;

  beforeAll(async () => {

    const module: TestingModule = await Test.createTestingModule(
      {providers: [TelegramService]}).compile();

    service = module.get<TelegramService>(TelegramService);

  });

  it('TelegramService should be defined', () => {
    expect(service).toBeDefined();
  });

});
