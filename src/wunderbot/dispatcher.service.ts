import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { WunderlistService } from '../wunderlist/wunderlist.service';
import * as TelegramBot from 'node-telegram-bot-api';
import { Message } from 'node-telegram-bot-api';
import { EventEmitterService } from '../ee/eventEmitter.service';
import { UsersService } from '../users/users.service';
import { instructionsMessage, taskAddedMessage, taskErrorMessage, tokenReceivedMessage, welcomeMessage } from '../telegram/telegram.messages';

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

    this.botClient.on('message', async (message: Message) => {
      if ( message.text !== '/start'){
        await this.onBotMessage(message);
      }
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

  async onBotMessage(message: Message){
    const tgUserId = message.from.id;
    const user = await this.usersService.getUserByTelegramUserId(tgUserId);

    try {
      await this.wunderlistService.addTaskFromTelegramMessage(message, user);
      await this.botClient.sendMessage(user.telegramChatId, taskAddedMessage);
    }catch (error) {
      try{
        await this.botClient.sendMessage(user.telegramChatId, taskErrorMessage);
        await this.botClient.sendMessage(user.telegramChatId, JSON.stringify(error));
        console.error(error);
      }catch (e) {
        console.error(e);
      }
    }

  }

  async onAuthTokenReceived(tgUserId: number, wuAuthToken: string): Promise<any> {
    const user = await this.usersService.getUserByTelegramUserId(tgUserId);

    user.wunderlistToken = wuAuthToken;
    await this.usersService.saveUser(user);

    await this.botClient.sendMessage(user.telegramChatId, tokenReceivedMessage);
    await this.botClient.sendMessage(user.telegramChatId, instructionsMessage);
  }

  async onBotStartMessage(message: Message): Promise<any> {
    const tgUserId = message.from.id;
    const chatId = message.chat.id;
    const user = await this.usersService.getUserByTelegramUserId(tgUserId);

    user.telegramChatId = chatId;
    await this.usersService.saveUser(user);

    const authUrl = this.wunderlistService.getAuthUrl(tgUserId);

    await this.botClient.sendMessage(chatId, welcomeMessage);
    await this.botClient.sendMessage(chatId, authUrl);

  }

}
