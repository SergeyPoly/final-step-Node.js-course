import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { ProjectsModule } from '../projects/projects.module'
import { CampaignsController } from './campaigns.controller'
import { CampaignsService } from './campaigns.service'
import { CampaignsRepository } from './campaigns.repository'
import { ProjectsRepository } from '../projects/projects.repository'
import {
  rabbitmqHost,
  rabbitmqPassword,
  rabbitmqQueueBillingOut,
  rabbitmqUser,
} from 'src/configs/rabbitmq.config'

@Module({
  imports: [
    TypeOrmModule.forFeature([CampaignsRepository, ProjectsRepository]),
    ProjectsModule,
    ClientsModule.register([
      {
        name: 'CAMPAIGN_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${rabbitmqUser}:${rabbitmqPassword}@${rabbitmqHost}`],
          queue: rabbitmqQueueBillingOut,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [CampaignsController],
  providers: [CampaignsService],
})
export class CampaignsModule {}
