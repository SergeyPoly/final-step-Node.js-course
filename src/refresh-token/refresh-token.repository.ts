import { NotFoundException } from '@nestjs/common'
import { DeleteResult, EntityRepository, Repository } from 'typeorm'

import { RefreshToken } from './refresh-token.entity'
import { SaveRefreshTokenDto } from './dto/save-refresh-token.dto'

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken> {
  async saveRefreshToken(
    saveRefreshTokenDto: SaveRefreshTokenDto
  ): Promise<RefreshToken> {
    const refreshToken = this.create({ ...saveRefreshTokenDto })
    return await this.save(refreshToken)
  }

  async deleteRefreshToken(id: string): Promise<void> {
    const refreshToken = await this.delete(id)
    if (!refreshToken.affected) {
      throw new NotFoundException()
    }
  }

  async removeOldRefreshToken(): Promise<DeleteResult> {
    const date = new Date()
    date.setDate(date.getDate() - 7)
    const query = this.createQueryBuilder('refresh-token').where(
      'createdAt < :date',
      {
        date,
      }
    )
    const result = await query.delete().execute()

    return result
  }
}
