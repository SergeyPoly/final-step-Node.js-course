import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { Request, Response } from 'express'

import { User } from '../user/user.entity'
import { UserService } from '../user/user.service'
import { AuthService } from './auth.service'
import { RefreshTokenService } from '../refresh-token/refresh-token.service'
import JwtRefreshGuard from './strategy/jwt-refresh.guard'
import JwtGuard from './strategy/jwt.guard'
import RequestWithUser from './types/requestWithUser.interface'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { ChangePasswordDto } from './dto/change-password.dto'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly userService: UserService
  ) {}

  @Post('/register')
  @HttpCode(200)
  register(@Body() registrationData: RegisterDto): Promise<User> {
    return this.authService.register(registrationData)
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginDto,
    @Res() response: Response
  ): Promise<User> {
    const user = await this.authService.getAuthenticatedUser(loginDto)

    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id
    )

    const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(
      user.id
    )

    response.cookie('access_token', accessTokenCookie, {
      httpOnly: true,
      expires: new Date(Date.now() + 15 * 60 * 1000),
    })

    response.cookie('refresh_token', refreshTokenCookie, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 3600000),
    })

    await this.refreshTokenService.saveRefreshToken({
      userId: user.id,
      token: refreshTokenCookie,
    })

    response.send(user)
    return user
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(200)
  async refresh(
    @Req() request: RequestWithUser,
    @Res() response: Response
  ): Promise<string> {
    const { user } = request
    const userId = user.id
    const token = request.cookies.refresh_token

    const accessTokenCookie =
      this.authService.getCookieWithJwtAccessToken(userId)

    const refreshTokenCookie =
      this.authService.getCookieWithJwtRefreshToken(userId)

    response.cookie('access_token', accessTokenCookie, {
      httpOnly: true,
      expires: new Date(Date.now() + 15 * 60 * 1000),
    })

    response.cookie('refresh_token', refreshTokenCookie, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 3600000),
    })

    await this.refreshTokenService.saveRefreshToken({
      userId,
      token: refreshTokenCookie,
    })
    await this.refreshTokenService.removeRefreshToken(token)

    response.send(userId)
    return userId
  }

  @Patch('/change-password')
  @UseGuards(JwtGuard)
  changePassword(
    @Req() request: RequestWithUser,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<User> {
    const { user } = request
    const userId = user.id
    const { oldPassword, newPassword } = changePasswordDto

    return this.authService.changePassword({
      userId,
      oldPassword,
      newPassword,
    })
  }

  @Get('/profile')
  @UseGuards(JwtGuard)
  async currentUser(@Req() request: RequestWithUser): Promise<User> {
    const { user } = request
    return await this.userService.findUserById(user.id)
  }

  @Post('/logout')
  @UseGuards(JwtGuard)
  async logout(@Req() request: Request, @Res() response: Response) {
    if (request.cookies.access_token || request.cookies.refresh_token) {
      response.cookie('access_token', 'logout', {
        maxAge: 0,
      })
      response.cookie('refresh_token', 'logout', {
        maxAge: 0,
      })
      await this.refreshTokenService.removeRefreshToken(
        request.cookies.refresh_token
      )

      response.send()
      return
    } else {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST
      )
    }
  }
}
