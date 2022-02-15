import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from '../user/user.module'
import { RefreshTokenRepository } from './refresh-token.repository'
import { RefreshTokenService } from './refresh-token.service'
import { RefreshTokenController } from './refresh-token.controller'

@Module({
  imports: [TypeOrmModule.forFeature([RefreshTokenRepository]), UserModule],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
  controllers: [RefreshTokenController],
})
export class RefreshTokenModule {}
