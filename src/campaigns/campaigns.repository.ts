import { EntityRepository, Repository } from 'typeorm'

import { Campaigns } from './campaigns.entity'
import { CampaignRecordDto } from './dto/create-campaign-record.dto'
import { CampaignsFilterOptionsDto } from './dto/get-campaigns-filter.dto'
import { Pagination } from '../common/paginate'

@EntityRepository(Campaigns)
export class CampaignsRepository extends Repository<Campaigns> {
  async createCampaignRecord(
    campaignRecordDto: CampaignRecordDto
  ): Promise<Campaigns> {
    const campaignRecord = this.create({
      ...campaignRecordDto,
    })

    return await this.save(campaignRecord)
  }

  async getCampaigns(
    campaignsFilterOptionsDto: CampaignsFilterOptionsDto
  ): Promise<Pagination<Campaigns>> {
    const {
      projectId,
      name,
      from,
      to,
      limit,
      offset,
      sortField,
      sortOrder,
      campaignStatus,
      paymentStatus,
    } = campaignsFilterOptionsDto || {}
    const query = this.createQueryBuilder('campaigns')

    query.andWhere('campaigns.projectId = :projectId', { projectId })

    if (name) {
      query.andWhere('LOWER(campaigns.name) LIKE LOWER(:name) ', {
        name: `%${name}%`,
      })
    }

    if (campaignStatus) {
      query.andWhere('campaigns.campaignStatus = :campaignStatus', {
        campaignStatus,
      })
    }

    if (paymentStatus) {
      query.andWhere('campaigns.paymentStatus = :paymentStatus', {
        paymentStatus,
      })
    }

    if (from) {
      query.andWhere('campaigns.createdAt BETWEEN :from AND :to', {
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
    return new Pagination<Campaigns>({
      results,
      total,
    })
  }
}
