import { Inject, Injectable } from '@nestjs/common';

import * as Wunderlist from 'wunderlist-api';

@Injectable()
export class WunderlistService {

  private apiClient;

  constructor(@Inject('ConfigProvider') config){
    this.apiClient = new Wunderlist({
      clientId: config.get(`wunderlist.appId`),
      clientSecret: config.get(`wunderlist.appSecret`),
      accessToken: config.get(`wunderlist.accessToken`),
    });
  }

  async getLists(){
    const { body } = await this.apiClient.getLists();
    return JSON.parse(body);
  }

  async addTask(task){

    const { body } = await this.apiClient.createTask(task.list_id, task.title, task.completed, task.starred, task.due_date);
    await this.apiClient.createNote(body.id, task.note);

    return body;

  }

  async addTaskFromTelegramMessage(message){
    const lists = await this.getLists();
    const inboxList = lists.find(list => list.title === 'inbox');
    const messageText = message.text;

    if (inboxList){
      const task = {
        list_id: inboxList.id,
        title: messageText.slice(0, 254),
        completed: false,
        starred: false,
        note: messageText,
      };

      await this.addTask(task);
    }
  }

}
