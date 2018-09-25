import * as TelegramBot from 'node-telegram-bot-api';

import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { WunderlistService } from '../wunderlist/wunderlist.service';
import { Message } from 'node-telegram-bot-api';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TelegramService implements OnModuleInit {

  private botClient;

  constructor(
    @Inject('ConfigProvider') config,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
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
  }

  async onBotMessage(message: Message): Promise<any> {
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
    const user = await this.getUserByTelegramUserId(tgUserId);

    if (!user.wunderlistToken){
      const authUrl = this.wunderlistService.getAuthUrl();
      const chatId = message.chat.id;

      await this.botClient.sendMessage(chatId, authUrl);
    }

  }

}
