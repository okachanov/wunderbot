import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { WunderlistService } from '../wunderlist/wunderlist.service';
import * as TelegramBot from 'node-telegram-bot-api';
import { Message } from 'node-telegram-bot-api';
import { EventEmitterService } from '../ee/eventEmitter.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class WunderbotDispatcherService implements OnModuleInit{

  private botClient;

  constructor(
    @Inject('ConfigProvider') config,
    private readonly wunderlistService: WunderlistService,
    private readonly ee: EventEmitterService,
    private readonly usersService: UsersService,
  ){

    this.botClient = new TelegramBot(config.get(`telegram.token`), {polling: true});

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

  onModuleInit(){
    Logger.log('Dispatcher started', 'WunderbotDispatcherService');
  }

  async onBotMessage(message){
    await this.wunderlistService.addTaskFromTelegramMessage(message);
  }

  async onAuthTokenReceived(tgUserId: number, wuAuthToken: string): Promise<any> {
    const user = await this.usersService.getUserByTelegramUserId(tgUserId);

    user.wunderlistToken = wuAuthToken;
    await this.usersService.saveUser(user);

    await this.botClient.sendMessage(user.telegramChatId, wuAuthToken);
  }

  async onBotStartMessage(message: Message): Promise<any> {
    const tgUserId = message.from.id;
    const chatId = message.chat.id;
    const user = await this.usersService.getUserByTelegramUserId(tgUserId);

    user.telegramChatId = chatId;
    await this.usersService.saveUser(user);

    if (!user.wunderlistToken){
      const authUrl = this.wunderlistService.getAuthUrl(tgUserId);

      await this.botClient.sendMessage(chatId, authUrl);
    }

  }

}
