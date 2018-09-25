import { Controller, Get, Post } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { WunderlistService } from './wunderlist.service';

@Controller('wunderlist')
@ApiUseTags('Wunderlist')
export class WunderlistController {

  constructor( private readonly wunderlistService: WunderlistService){
   }

  @Get('auth')
  async get(): Promise<any> {
    console.log('get auth');
    return true;
  }

  @Post('auth')
  async post(): Promise<any> {
    console.log('post auth');
    return true;
  }

}
