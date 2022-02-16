import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { User } from './user.entity'
import { UserService } from './user.service'
import { UpdateUserDto } from './dto/update-user.dto'
import JwtGuard from 'src/auth/strategy/jwt.guard'
import RequestWithUser from 'src/auth/types/requestWithUser.interface'

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @UseGuards(JwtGuard)
  findUserById(@Req() request: RequestWithUser): Promise<User> {
    return this.userService.findUserById(request.user.id)
  }

  @Patch('/update')
  @UseGuards(JwtGuard)
  updateUser(
    @Body() updateUserSignDto: UpdateUserDto,
    @Req() request: RequestWithUser
  ): Promise<User> {
    return this.userService.updateUser(updateUserSignDto, request.user.id)
  }
}
