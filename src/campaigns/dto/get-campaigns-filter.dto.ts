import {
  IsOptional,
  IsDate,
  IsNumber,
  IsString,
  IsEnum,
  IsUUID,
  IsNotEmpty,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { SortOrder } from '../../common/enums/sort.enum'
import {
  CampaignStatus,
  PaymentStatus,
} from '../../common/enums/campaigns.enum'

export class CampaignsFilterOptionsDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID('all')
  projectId: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string

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
  @IsString()
  sortField?: string

  @ApiProperty()
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  from?: Date

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  to?: Date

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number
}
