import {
  Injectable,
  UnprocessableEntityException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, UpdateResult } from 'typeorm'

import { Campaigns } from '../campaigns/campaigns.entity'
import { Projects } from './projects.entity'
import { ProjectsRepository } from './projects.repository'
import { ProjectRecordDto } from './dto/create-project-record.dto'
import { UpdateProjectRecordDto } from './dto/update-project-record.dto'
import { ProjectsFilterOptionsDto } from './dto/get-projects-filter.dto'
import { Pagination } from '../common/paginate'

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsRepository)
    private readonly projectsRepository: ProjectsRepository
  ) {}

  async createProjectRecord(
    projectRecordDto: ProjectRecordDto,
    createdBy: string
  ): Promise<Projects> {
    const { name } = projectRecordDto
    const existProjectName = await this.projectsRepository.findOne({
      name,
      createdBy,
    })

    if (existProjectName) {
      throw new UnprocessableEntityException(
        'project with the same name already exists'
      )
    }

    return await this.projectsRepository.createProjectRecord(
      projectRecordDto,
      createdBy
    )
  }

  async updateProjectRecord(
    updateProjectRecordDto: UpdateProjectRecordDto,
    createdBy: string
  ): Promise<Projects> {
    const { id, name, logo } = updateProjectRecordDto
    const project = await this.getProjectById(id, createdBy)
    this.checkOwner(createdBy, project.createdBy)

    if (name) {
      const existProjectName = await this.projectsRepository.findOne({
        where: {
          id: Not(id),
          name,
          createdBy,
        },
      })

      if (existProjectName) {
        throw new UnprocessableEntityException(
          'project with the same name already exists'
        )
      }

      project.name = name
    }

    if (logo) {
      project.logo = logo
    }

    return this.projectsRepository.save(project)
  }

  async getProjectCampaigns(
    id: string,
    createdBy: string
  ): Promise<Campaigns[]> {
    const project = await this.getProjectById(id, createdBy)

    return project.campaigns
  }

  async deleteProjectRecord(
    id: string,
    createdBy: string
  ): Promise<UpdateResult> {
    await this.getProjectById(id, createdBy)

    return this.projectsRepository.softDelete(id)
  }

  getProjects(
    projectsFilterOptionsDto: ProjectsFilterOptionsDto,
    createdBy: string
  ): Promise<Pagination<Projects>> {
    return this.projectsRepository.getProjects(
      projectsFilterOptionsDto,
      createdBy
    )
  }

  async getProjectById(id: string, createdBy: string): Promise<Projects> {
    if (!id) {
      throw new BadRequestException('project ID required')
    }

    const project = await this.projectsRepository.findOne(id)
    if (!project) {
      throw new NotFoundException('project with this ID not found')
    }
    this.checkOwner(createdBy, project.createdBy)

    return project
  }

  checkOwner(requestUserId: string, projectCreatorId: string): void {
    if (requestUserId !== projectCreatorId) {
      throw new UnprocessableEntityException(
        'you can access only your own projects'
      )
    }
  }
}
