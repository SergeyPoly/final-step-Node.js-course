import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserModule } from '../user/user.module'
import { RefreshTokenController } from './refresh-token.controller'
import { RefreshTokenService } from './refresh-token.service'
import { RefreshTokenRepository } from './refresh-token.repository'

@Module({
  imports: [TypeOrmModule.forFeature([RefreshTokenRepository]), UserModule],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
  controllers: [RefreshTokenController],
})
export class RefreshTokenModule {}
