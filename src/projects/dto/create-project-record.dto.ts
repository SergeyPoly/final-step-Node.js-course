import {
  IsString,
  IsNotEmpty,
  Length,
  Matches,
  IsOptional,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ProjectRecordDto {
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
}
