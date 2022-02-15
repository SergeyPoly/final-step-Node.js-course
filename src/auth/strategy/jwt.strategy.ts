import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { UserService } from '../../user/user.service'
import { TokenPayload } from '../types/tokenPayload.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.access_token
        },
      ]),
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  async validate(payload: TokenPayload) {
    return this.userService.findUserById(payload.userId)
  }
}
