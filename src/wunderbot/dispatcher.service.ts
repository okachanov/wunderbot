import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { WunderlistService } from '../wunderlist/wunderlist.service';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class WunderbotDispatcherService implements OnModuleInit{

  private botClient;

  constructor(
    @Inject('ConfigProvider') config,
    private readonly wunderlistService: WunderlistService,
  ){

    this.botClient = new TelegramBot(config.get(`telegram.token`), {polling: true});
    this.botClient.on('message', async (message) => {
      await this.onBotMessage(message);
    });

  }

  onModuleInit(){
    Logger.log('Dispatcher started', 'WunderbotDispatcherService');
  }

  async onBotMessage(message){
    await this.wunderlistService.addTaskFromTelegramMessage(message);
  }

}
