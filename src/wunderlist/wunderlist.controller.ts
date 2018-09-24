import { Controller, Get} from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { WunderlistService } from './wunderlist.service';

@Controller('wunderlist')
@ApiUseTags('Wunderlist')
export class WunderlistController {

  constructor( private readonly wunderlistService: WunderlistService){
   }

  @Get('lists')
  async get(): Promise<any[]> {
    return await this.wunderlistService.getLists();
  }

}
