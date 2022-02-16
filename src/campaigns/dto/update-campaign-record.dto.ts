import {
  IsString,
  IsNotEmpty,
  Length,
  Matches,
  IsOptional,
  IsUUID,
  IsEnum,
  IsEmail,
  IsArray,
  IsDate,
  IsNumber,
  IsPositive,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  CampaignStatus,
  PaymentStatus,
} from '../../common/enums/campaigns.enum'

export class UpdateCampaignRecordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID('all')
  id: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(3, 20)
  name?: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(/^.*\.(jpe?g|png|gif)$/i, {
    message: 'invalid image file extension, supported formats jpeg,png,gif',
  })
  logo?: string

  @ApiProperty()
  @IsOptional()
  @IsArray()
  links?: string[]

  @ApiProperty()
  @IsOptional()
  @IsArray()
  audioKeyWords?: string[]

  @ApiProperty()
  @IsOptional()
  @IsArray()
  textKeyWords?: string[]

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date

  @ApiProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEmail()
  adminEmail?: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  // @IsPhoneNumber() TODO необходимо уточнение по принципу работы
  adminPhone?: string

  @ApiProperty()
  @IsOptional()
  @IsEnum(CampaignStatus)
  campaignStatus?: CampaignStatus

  @ApiProperty()
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  cost?: number
}
