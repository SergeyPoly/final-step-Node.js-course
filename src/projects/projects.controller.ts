import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { UpdateResult } from 'typeorm'

import { Projects } from './projects.entity'
import { Campaigns } from '../campaigns/campaigns.entity'
import { ProjectsService } from './projects.service'
import { ProjectRecordDto } from './dto/create-project-record.dto'
import { UpdateProjectRecordDto } from './dto/update-project-record.dto'
import { ProjectsFilterOptionsDto } from './dto/get-projects-filter.dto'
import JwtGuard from 'src/auth/strategy/jwt.guard'
import RequestWithUser from '../auth/types/requestWithUser.interface'
import { Pagination } from '../common/paginate'

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('/create')
  @UseGuards(JwtGuard)
  createProjectRecord(
    @Body() projectRecordDto: ProjectRecordDto,
    @Req() request: RequestWithUser
  ): Promise<Projects> {
    return this.projectsService.createProjectRecord(
      projectRecordDto,
      request.user.id
    )
  }

  @Patch('/update')
  @UseGuards(JwtGuard)
  updateProjectRecord(
    @Body() updateProjectRecordDto: UpdateProjectRecordDto,
    @Req() request: RequestWithUser
  ): Promise<Projects> {
    return this.projectsService.updateProjectRecord(
      updateProjectRecordDto,
      request.user.id
    )
  }

  @Post()
  @UseGuards(JwtGuard)
  @HttpCode(200)
  getProjects(
    @Body() projectsFilterOptionsDto: ProjectsFilterOptionsDto,
    @Req() request: RequestWithUser
  ): Promise<Pagination<Projects>> {
    return this.projectsService.getProjects(
      projectsFilterOptionsDto,
      request.user.id
    )
  }

  @Get('/campaigns/:id')
  @UseGuards(JwtGuard)
  getProjectCampaigns(
    @Param('id') id: string,
    @Req() request: RequestWithUser
  ): Promise<Campaigns[]> {
    return this.projectsService.getProjectCampaigns(id, request.user.id)
  }

  @Get('/:id')
  @UseGuards(JwtGuard)
  getProjectById(
    @Param('id') id: string,
    @Req() request: RequestWithUser
  ): Promise<Projects> {
    return this.projectsService.getProjectById(id, request.user.id)
  }

  @Delete('/:id')
  @UseGuards(JwtGuard)
  deleteProjectRecord(
    @Param('id') id: string,
    @Req() request: RequestWithUser
  ): Promise<UpdateResult> {
    return this.projectsService.deleteProjectRecord(id, request.user.id)
  }
}
