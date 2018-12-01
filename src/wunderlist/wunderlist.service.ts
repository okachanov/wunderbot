import { Inject, Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';
import { Message } from 'node-telegram-bot-api';
import * as WunderlistClient from 'wunderlist-api';

@Injectable()
export class WunderlistService {

  constructor(@Inject('ConfigProvider') private readonly config){
  }

  async getLists(apiClient: WunderlistClient){
    const { body } = await apiClient.getLists();
    return JSON.parse(body);
  }

  getApiClientByUserToken(wunderlistToken: string){
    return new WunderlistClient({
      clientId: this.config.get(`wunderlist.appId`),
      clientSecret: this.config.get(`wunderlist.appSecret`),
      accessToken: wunderlistToken,
    });
  }

  async addTaskFromTelegramMessage(message: Message, user: User){

    const client = this.getApiClientByUserToken(user.wunderlistToken);

    const lists = await this.getLists(client);
    const inboxList = lists.find(list => list.title === 'inbox');
    const messageText = message.text;

    if (inboxList){
      const task = {
        list_id: inboxList.id,
        title: messageText.slice(0, 254),
        completed: false,
        starred: false,
        note: messageText,
        due_date: null,
      };

      const { body } = await client.createTask(task.list_id, task.title, task.completed, task.starred, task.due_date);
      await client.createNote(body.id, task.note);

      return body;

    }
  }

  getAuthUrl(state: string | number = ''): string {
    const callbackUrl = this.config.get(`appWebUrl`) + `api/v1/wunderlist/auth`;
    const clientId = this.config.get(`wunderlist.appId`);

    return `https://www.wunderlist.com/oauth/authorize?client_id=${clientId}&redirect_uri=${callbackUrl}&state=${state}`;
  }

}
