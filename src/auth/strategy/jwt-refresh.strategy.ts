import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { TokenPayload } from '../types/tokenPayload.interface'
import { RefreshTokenService } from '../../refresh-token/refresh-token.service'

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token'
) {
  constructor(private readonly refreshTokenService: RefreshTokenService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refresh_token
        },
      ]),
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    })
  }

  async validate(request: Request, payload: TokenPayload) {
    const refreshToken = request.cookies?.refresh_token

    return this.refreshTokenService.getUserIfRefreshTokenMatches({
      token: refreshToken,
      userId: payload.userId,
    })
  }
}
