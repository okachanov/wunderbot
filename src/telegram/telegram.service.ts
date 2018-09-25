import * as TelegramBot from 'node-telegram-bot-api';

import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { WunderlistService } from '../wunderlist/wunderlist.service';
import { Message } from 'node-telegram-bot-api';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitterService } from '../ee/eventEmitter.service';

@Injectable()
export class TelegramService implements OnModuleInit {

  private botClient;

  constructor(
    @Inject('ConfigProvider') config,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly ee: EventEmitterService,
    private readonly wunderlistService: WunderlistService,
  ){
    this.botClient = new TelegramBot(config.get(`telegram.token`), {polling: true});
  }

  onModuleInit(){
    this.botClient.on('message', async (message) => {
      await this.onBotMessage(message);
    });
    this.botClient.onText(/\/start/, async (message: Message, match: string[]) => {
      await this.onBotStartMessage(message);
    });
    this.ee.on(`access_token_received`, async (tgUserId: number, wuAuthToken: string) => {
      await this.onAuthTokenReceived(tgUserId, wuAuthToken);
    });
  }

  async onBotMessage(message: Message): Promise<any> {
  }

  async onAuthTokenReceived(tgUserId: number, wuAuthToken: string): Promise<any> {
    const user = await this.getUserByTelegramUserId(tgUserId);

    user.wunderlistToken = wuAuthToken;
    await this.usersRepository.save(user);

    await this.botClient.sendMessage(user.telegramChatId, wuAuthToken);
  }

  async getUserByTelegramUserId(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne({telegramUserId: userId});
    if (user){
      return user;
    }else {
      const newUser = new User();
      newUser.telegramUserId = userId;
      return this.usersRepository.save(newUser);
    }
  }

  async onBotStartMessage(message: Message): Promise<any> {
    const tgUserId = message.from.id;
    const chatId = message.chat.id;
    const user = await this.getUserByTelegramUserId(tgUserId);

    user.telegramChatId = chatId;
    await this.usersRepository.save(user);

    if (!user.wunderlistToken){
      const authUrl = this.wunderlistService.getAuthUrl(tgUserId);

      await this.botClient.sendMessage(chatId, authUrl);
    }

  }

}
