import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import JwtGuard from 'src/auth/strategy/jwt.guard'
import RequestWithUser from 'src/auth/types/requestWithUser.interface'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './user.entity'
import { UserService } from './user.service'

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
