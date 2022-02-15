import { JwtModuleOptions } from '@nestjs/jwt'

export const jwtModuleConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: '15m',
  },
}

export default jwtModuleConfig
