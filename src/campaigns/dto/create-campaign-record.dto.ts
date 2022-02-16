import {
  IsString,
  IsNotEmpty,
  Length,
  Matches,
  IsArray,
  IsDate,
  IsOptional,
  IsBoolean,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { Projects } from '../../projects/projects.entity'

export class CampaignRecordDto {
  @ApiProperty()
  @IsNotEmpty()
  project: Projects

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(3, 70)
  name: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(/^.*\.(jpe?g|png|pdf)$/i, {
    message: 'invalid image file extension, supported formats jpeg,png,pdf',
  })
  logo?: string

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  links: string[]

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  audioKeyWords: string[]

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  textKeyWords: string[]

  @ApiProperty()
  @IsOptional()
  @IsArray()
  analyzedPictures?: string[]

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
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  adminEmail: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  // @IsPhoneNumber() TODO необходимо уточнение по принципу работы
  adminPhone?: string

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  emotionDetection?: boolean
}
