import { EntityRepository, Repository } from 'typeorm'

import { Projects } from './projects.entity'
import { ProjectRecordDto } from './dto/create-project-record.dto'
import { ProjectsFilterOptionsDto } from './dto/get-projects-filter.dto'
import { Pagination } from '../common/paginate'

@EntityRepository(Projects)
export class ProjectsRepository extends Repository<Projects> {
  async createProjectRecord(
    projectRecordDto: ProjectRecordDto,
    createdBy: string
  ): Promise<Projects> {
    const projectRecord = this.create({
      ...projectRecordDto,
      createdBy,
    })

    return await this.save(projectRecord)
  }

  async getProjects(
    projectsFilterOptionsDto: ProjectsFilterOptionsDto,
    createdBy: string
  ): Promise<Pagination<Projects>> {
    const { name, from, to, limit, offset, sortField, sortOrder } =
      projectsFilterOptionsDto || {}
    const query = this.createQueryBuilder('projects')

    query.andWhere('projects.createdBy = :createdBy', { createdBy })

    if (name) {
      query.andWhere('LOWER(projects.name) LIKE LOWER(:name) ', {
        name: `%${name}%`,
      })
    }

    if (from) {
      query.andWhere('projects.createdAt BETWEEN :from AND :to', {
        from,
        to: to ? to : new Date().toISOString(),
      })
    }

    if (sortField && sortOrder) {
      query.orderBy(sortField, sortOrder)
    }

    query.limit(limit || limit === 0 ? limit : 50)
    query.offset(offset ? offset : 0)

    const [results, total] = await query.getManyAndCount()
    return new Pagination<Projects>({
      results,
      total,
    })
  }
}
