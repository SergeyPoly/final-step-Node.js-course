import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult } from 'typeorm'
import { User } from '../user/user.entity'
import { UserService } from '../user/user.service'
import { UserByRefreshTokenDto } from './dto/user-refresh-token.dto'
import { SaveRefreshTokenDto } from './dto/save-refresh-token.dto'
import { RefreshToken } from './refresh-token.entity'
import { RefreshTokenRepository } from './refresh-token.repository'

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshTokenRepository)
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly usersService: UserService
  ) {}

  async saveRefreshToken(
    saveRefreshTokenDto: SaveRefreshTokenDto
  ): Promise<RefreshToken> {
    return await this.refreshTokenRepository.saveRefreshToken({
      ...saveRefreshTokenDto,
    })
  }

  async getRefreshTokensByUserId(userId: string): Promise<RefreshToken> {
    const token = await this.refreshTokenRepository.findOne({ userId })
    if (!token) {
      throw new NotFoundException('Refresh token not found')
    }
    return token
  }

  async getRefreshTokenByToken(token: string): Promise<RefreshToken> {
    const tokenInfo = await this.refreshTokenRepository.findOne({
      where: { token },
    })

    if (!tokenInfo) {
      throw new NotFoundException('Refresh token not found')
    }
    return tokenInfo
  }

  async getRefreshToken(token: string, userId: string): Promise<RefreshToken> {
    const tokenInfo = await this.refreshTokenRepository.findOne({
      where: {
        token,
        userId,
      },
    })

    if (!tokenInfo) {
      throw new NotFoundException('Refresh token not found')
    }
    return tokenInfo
  }

  async getUserIfRefreshTokenMatches(
    userByRefreshTokenDto: UserByRefreshTokenDto
  ): Promise<User> {
    const { token, userId } = userByRefreshTokenDto

    const currentRefreshToken = await this.getRefreshToken(token, userId)

    if (currentRefreshToken) {
      return this.usersService.findUserById(userId)
    }
  }

  async removeRefreshToken(refreshToken: string): Promise<void> {
    const token = await this.getRefreshTokenByToken(refreshToken)
    await this.refreshTokenRepository.delete(token.id)
  }

  async removeOldRefreshToken(): Promise<DeleteResult> {
    return await this.refreshTokenRepository.removeOldRefreshToken()
  }
}
