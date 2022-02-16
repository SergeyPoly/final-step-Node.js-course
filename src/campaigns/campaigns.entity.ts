import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm'
import { Projects } from '../projects/projects.entity'
import { CampaignStatus, PaymentStatus } from '../common/enums/campaigns.enum'

@Entity({ database: 'default' })
export class Campaigns {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  projectId: string

  @ManyToOne(() => Projects)
  project: Projects

  @Column({ nullable: true })
  name: string

  @Column({ nullable: true })
  logo: string

  @Column('simple-array')
  links: string[]

  @Column('simple-array', { nullable: true })
  audioKeyWords: string[]

  @Column('simple-array', { nullable: true })
  textKeyWords: string[]

  @Column('simple-array', { nullable: true })
  analyzedPictures: string[]

  @Column({
    type: 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.DRAFT,
    enumName: 'campaignStatus',
  })
  campaignStatus: CampaignStatus

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.NOT_PAID,
    enumName: 'paymentStatus',
  })
  paymentStatus: PaymentStatus

  @Column({ nullable: true })
  startDate: Date

  @Column({ nullable: true })
  endDate: Date

  @Column({ nullable: true })
  adminEmail: string

  @Column({ nullable: true })
  adminPhone: string

  @Column({ default: false })
  emotionDetection: boolean

  @Column({ default: 0 })
  cost: number

  @Column({ default: 0 })
  totalDuration: number

  @Column({ default: 0 })
  commentsCount: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date
}
