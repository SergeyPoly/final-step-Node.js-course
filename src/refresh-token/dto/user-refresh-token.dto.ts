import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UserByRefreshTokenDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  userId: string

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  token: string
}
