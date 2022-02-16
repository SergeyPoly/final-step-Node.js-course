import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm'
import { Campaigns } from '../campaigns/campaigns.entity'

@Entity({ database: 'default' })
export class Projects {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: true })
  name: string

  @Column({ nullable: true })
  logo: string

  @Column({ nullable: true })
  createdBy: string

  @OneToMany(() => Campaigns, (campaign) => campaign.project)
  campaigns: Promise<Campaigns[]>

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt?: Date
}
