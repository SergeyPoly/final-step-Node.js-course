import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'

import { pgConnectionConfig } from './configs/pg.config'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { RefreshTokenModule } from './refresh-token/refresh-token.module'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UserModule,
    TypeOrmModule.forRoot(pgConnectionConfig),
    AuthModule,
    RefreshTokenModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
