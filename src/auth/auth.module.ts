import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { RefreshTokenModule } from '../refresh-token/refresh-token.module'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { jwtModuleConfig } from '../configs/jwt.config'
import { JwtStrategy } from './strategy/jwt.strategy'
import { JwtRefreshTokenStrategy } from './strategy/jwt-refresh.strategy'

@Module({
  imports: [
    UserModule,
    RefreshTokenModule,
    JwtModule.register(jwtModuleConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshTokenStrategy],
})
export class AuthModule {}
