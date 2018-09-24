import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { WunderlistService } from '../wunderlist/wunderlist.service';

@Injectable()
export class TelegramService implements OnModuleInit {

  private botClient;

  constructor(
    @Inject('ConfigProvider') config,
    private readonly wunderlistService: WunderlistService,
  ){
    this.botClient = new TelegramBot(config.get(`telegram.token`), {polling: true});
  }

  onModuleInit(){
    this.botClient.on('message', async (message) => {
      await this.onBotMessage(message);
    });
  }

  async onBotMessage(message){
    await this.wunderlistService.addTaskFromTelegramMessage(message);
  }

}
