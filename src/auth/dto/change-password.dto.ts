import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ChangePasswordDto {
  @ApiProperty({ required: true })
  @IsString()
  oldPassword: string

  @ApiProperty({ required: true })
  @IsString()
  newPassword: string
}
