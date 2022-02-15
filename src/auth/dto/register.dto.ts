import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  email: string

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  password: string
}
