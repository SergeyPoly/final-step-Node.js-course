import { Body, Controller, Post } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { User } from '../user/user.entity'
import { DeleteResult } from 'typeorm'
import { RefreshTokenService } from './refresh-token.service'
import { UserByRefreshTokenDto } from './dto/user-refresh-token.dto'

@Controller('refresh-token')
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'remove_old_refresh_token',
  })
  @Post('/remove-old')
  removeOldRefreshToken(): Promise<DeleteResult> {
    return this.refreshTokenService.removeOldRefreshToken()
  }

  @Post('/get-user-by-refresh-token')
  async getUserIfRefreshTokenMatches(
    @Body() userByRefreshTokenDto: UserByRefreshTokenDto
  ): Promise<User> {
    return this.refreshTokenService.getUserIfRefreshTokenMatches(
      userByRefreshTokenDto
    )
  }
}
