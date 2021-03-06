import * as superagent from 'superagent';

import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { OauthCallbackDto } from './wunderlist.dto';
import { EventEmitterService } from '../ee/eventEmitter.service';

@Controller('wunderlist')
@ApiUseTags('Wunderlist')
export class WunderlistController {

  constructor(
    @Inject('ConfigProvider') private readonly config,
    private readonly ee: EventEmitterService){
   }

  @Get('auth')
  async oauthCallback(@Query() query: OauthCallbackDto): Promise<any> {

    const tgUserId = query.state;
    const authCode = query.code;

    try {
      const response = await superagent
        .post(`https://www.wunderlist.com/oauth/access_token`)
        .send({
          client_id: this.config.get(`wunderlist.appId`),
          client_secret: this.config.get(`wunderlist.appSecret`),
          code: authCode,
        });

      const { body: {access_token} } = response;

      if (access_token){
        this.ee.emit(`access_token_received`, tgUserId, access_token);
        return "Token received. You can close this tab";
      }else {
        throw new Error(`API returned no access_token`);
      }

    }catch (e) {
      console.error(e);
      return e;
    }

  }

}
