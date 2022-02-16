import {
  Injectable,
  UnprocessableEntityException,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ClientProxy } from '@nestjs/microservices'
import { DeleteResult, Not } from 'typeorm'

import { Campaigns } from './campaigns.entity'
import { ProjectsService } from '../projects/projects.service'
import { CampaignsRepository } from './campaigns.repository'
import { ProjectsRepository } from '../projects/projects.repository'
import { CampaignRecordDto } from './dto/create-campaign-record.dto'
import { UpdateCampaignRecordDto } from './dto/update-campaign-record.dto'
import { CampaignsFilterOptionsDto } from './dto/get-campaigns-filter.dto'
import { UpdateCampaignBillingDto } from './dto/update-campaign-billing.dto'
import { Pagination } from '../common/paginate'

@Injectable()
export class CampaignsService {
  constructor(
    @Inject('CAMPAIGN_SERVICE') private readonly client: ClientProxy,
    @InjectRepository(CampaignsRepository)
    private readonly campaignsRepository: CampaignsRepository,
    private readonly projectsRepository: ProjectsRepository,
    private readonly projectsService: ProjectsService
  ) {}

  async updateCampaignBilling(
    updateCampaignBillingDto: UpdateCampaignBillingDto
  ) {
    const { id, totalDuration, commentsCount } = updateCampaignBillingDto

    const campaign = await this.campaignsRepository.findOne(id)
    campaign.totalDuration = totalDuration
    campaign.commentsCount = commentsCount

    return this.campaignsRepository.save(campaign)
  }

  async sendDataForBilling(data: Campaigns) {
    this.client.emit('billing-out', data)
  }

  async createCampaignRecord(
    campaignRecordDto: CampaignRecordDto,
    userId: string
  ): Promise<Campaigns> {
    const { name, project } = campaignRecordDto
    this.projectsService.checkOwner(userId, project.createdBy)

    const existCampaignName = await this.campaignsRepository.findOne({
      name,
      project,
    })

    if (existCampaignName) {
      throw new UnprocessableEntityException(
        'campaign with the same name already exists'
      )
    }

    return await this.campaignsRepository.createCampaignRecord(
      campaignRecordDto
    )
  }

  async updateCampaignRecord(
    updateCampaignRecordDto: UpdateCampaignRecordDto,
    userId: string
  ): Promise<Campaigns> {
    const {
      id,
      name,
      logo,
      links,
      audioKeyWords,
      textKeyWords,
      startDate,
      endDate,
      adminEmail,
      adminPhone,
      campaignStatus,
      paymentStatus,
      cost,
    } = updateCampaignRecordDto
    const campaign = await this.getCampaignById(id, userId)
    const project = await this.projectsRepository.findOne(campaign.projectId)

    if (name) {
      const existCampaignName = await this.campaignsRepository.findOne({
        where: {
          id: Not(id),
          name,
          project,
        },
      })

      if (existCampaignName) {
        throw new UnprocessableEntityException(
          'campaign with the same name already exists'
        )
      }

      campaign.name = name
    }

    if (logo) {
      campaign.logo = logo
    }

    if (links) {
      campaign.links = links
    }

    if (audioKeyWords !== undefined) {
      campaign.audioKeyWords = audioKeyWords
    }

    if (textKeyWords !== undefined) {
      campaign.textKeyWords = textKeyWords
    }

    if (startDate !== undefined) {
      campaign.startDate = startDate
    }

    if (endDate !== undefined) {
      campaign.endDate = endDate
    }

    if (adminEmail) {
      campaign.adminEmail = adminEmail
    }

    if (adminPhone !== undefined) {
      campaign.adminPhone = adminPhone
    }

    if (campaignStatus) {
      campaign.campaignStatus = campaignStatus
    }

    if (paymentStatus) {
      campaign.paymentStatus = paymentStatus
    }

    if (cost) {
      campaign.cost = cost
    }

    return this.campaignsRepository.save(campaign)
  }

  async deleteCampaignRecord(
    id: string,
    userId: string
  ): Promise<DeleteResult> {
    await this.getCampaignById(id, userId)

    return this.campaignsRepository.softDelete(id)
  }

  async getCampaigns(
    campaignsFilterOptionsDto: CampaignsFilterOptionsDto,
    userId: string
  ): Promise<Pagination<Campaigns>> {
    const { projectId } = campaignsFilterOptionsDto
    await this.projectsService.getProjectById(projectId, userId)

    return this.campaignsRepository.getCampaigns(campaignsFilterOptionsDto)
  }

  async getCampaignById(id: string, userId: string): Promise<Campaigns> {
    if (!id) {
      throw new BadRequestException('campaign ID required')
    }

    const campaign = await this.campaignsRepository.findOne(id)
    if (!campaign) {
      throw new NotFoundException('campaign with this ID not found')
    }
    const project = await this.projectsRepository.findOne(campaign.projectId)
    this.projectsService.checkOwner(userId, project.createdBy)

    return campaign
  }
}
