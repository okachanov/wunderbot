import { IsString, IsNumber } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class OauthCallbackDto {

  @IsNumber()
  @ApiModelProperty()
  readonly state: number;

  @IsString()
  @ApiModelProperty()
  readonly code: string;

}
