import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({ database: 'default', name: 'refresh-token' })
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: false })
  userId: string

  @Column({ nullable: false, type: 'text' })
  token: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
