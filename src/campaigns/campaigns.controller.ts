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
import { EventPattern } from '@nestjs/microservices'
import { DeleteResult } from 'typeorm'

import { Campaigns } from './campaigns.entity'
import { CampaignsService } from './campaigns.service'
import { CampaignRecordDto } from './dto/create-campaign-record.dto'
import { UpdateCampaignRecordDto } from './dto/update-campaign-record.dto'
import { CampaignsFilterOptionsDto } from './dto/get-campaigns-filter.dto'
import { UpdateCampaignBillingDto } from './dto/update-campaign-billing.dto'
import JwtGuard from 'src/auth/strategy/jwt.guard'
import RequestWithUser from 'src/auth/types/requestWithUser.interface'
import { Pagination } from '../common/paginate'

@ApiTags('Campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @EventPattern('billing-in')
  async updateCampaignBilling(
    updateCampaignBillingDto: UpdateCampaignBillingDto
  ) {
    return this.campaignsService.updateCampaignBilling(updateCampaignBillingDto)
  }

  @Post('/send-data-for-billing')
  sendDataForBilling(@Body() data: Campaigns) {
    return this.campaignsService.sendDataForBilling(data)
  }

  @Post('/create')
  @UseGuards(JwtGuard)
  createCampaignRecord(
    @Body() campaignRecordDto: CampaignRecordDto,
    @Req() request: RequestWithUser
  ): Promise<Campaigns> {
    return this.campaignsService.createCampaignRecord(
      campaignRecordDto,
      request.user.id
    )
  }

  @Patch('/update')
  @UseGuards(JwtGuard)
  updateCampaignRecord(
    @Body() updateCampaignRecordDto: UpdateCampaignRecordDto,
    @Req() request: RequestWithUser
  ): Promise<Campaigns> {
    return this.campaignsService.updateCampaignRecord(
      updateCampaignRecordDto,
      request.user.id
    )
  }

  @Post()
  @UseGuards(JwtGuard)
  @HttpCode(200)
  getCampaigns(
    @Body() campaignsFilterOptionsDto: CampaignsFilterOptionsDto,
    @Req() request: RequestWithUser
  ): Promise<Pagination<Campaigns>> {
    return this.campaignsService.getCampaigns(
      campaignsFilterOptionsDto,
      request.user.id
    )
  }

  @Get('/:id')
  @UseGuards(JwtGuard)
  getCampaignById(
    @Param('id') id: string,
    @Req() request: RequestWithUser
  ): Promise<Campaigns> {
    return this.campaignsService.getCampaignById(id, request.user.id)
  }

  @Delete('/:id')
  @UseGuards(JwtGuard)
  deleteCampaignRecord(
    @Param('id') id: string,
    @Req() request: RequestWithUser
  ): Promise<DeleteResult> {
    return this.campaignsService.deleteCampaignRecord(id, request.user.id)
  }
}
