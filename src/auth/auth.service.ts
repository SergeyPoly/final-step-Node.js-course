import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { hash, compare } from 'bcrypt'

import { User } from '../user/user.entity'
import { UserService } from '../user/user.service'
import { TokenPayload } from './types/tokenPayload.interface'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async register(registrationData: RegisterDto): Promise<User> {
    const hashedPassword = await hash(registrationData.password, 10)
    const createdUser = await this.usersService.createUser({
      ...registrationData,
      password: hashedPassword,
    })
    createdUser.password = undefined
    return createdUser
  }

  async getAuthenticatedUser(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto

    if (!email) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST
      )
    }

    try {
      const user = await this.usersService.findUserByEmail(email)
      await this.verifyPassword(password, user.password)
      user.password = undefined
      return user
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  public getCookieWithJwtAccessToken(userId: string) {
    const payload: TokenPayload = { userId }
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: `15m`,
    })
  }

  public getCookieWithJwtRefreshToken(userId: string) {
    const payload: TokenPayload = { userId }
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: `7d`,
    })
  }

  async changePassword({ userId, oldPassword, newPassword }): Promise<User> {
    const user = await this.usersService.findFullUserById(userId)

    await this.verifyPassword(oldPassword, user.password)
    const newPasswordHash = await hash(newPassword, 10)
    await this.usersService.updateUser({ password: newPasswordHash }, userId)
    user.password = undefined
    return user
  }

  async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<void> {
    const isPasswordMatching = await compare(plainTextPassword, hashedPassword)
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST
      )
    }
  }
}
