import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsPositive,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateCampaignBillingDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID('all')
  id: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  totalDuration: number

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  commentsCount: number
}
