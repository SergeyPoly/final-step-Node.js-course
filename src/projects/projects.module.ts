import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProjectsController } from './projects.controller'
import { ProjectsService } from './projects.service'
import { ProjectsRepository } from './projects.repository'

@Module({
  imports: [TypeOrmModule.forFeature([ProjectsRepository])],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
