import {
  IsString,
  IsNotEmpty,
  Length,
  Matches,
  IsOptional,
  IsUUID,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class UpdateProjectRecordDto {
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
}
