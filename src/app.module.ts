import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'

import { pgConnectionConfig } from './configs/pg.config'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { RefreshTokenModule } from './refresh-token/refresh-token.module'
import { ProjectsModule } from './projects/projects.module'
import { CampaignsModule } from './campaigns/campaigns.module'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(pgConnectionConfig),
    UserModule,
    AuthModule,
    RefreshTokenModule,
    ProjectsModule,
    CampaignsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
