import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { User } from './user.entity'
import { UserRepository } from './user.repository'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto
    const isUserExist = await this.isUserExist({ email })

    if (isUserExist) {
      throw new HttpException(
        'User with such email already exists',
        HttpStatus.UNPROCESSABLE_ENTITY
      )
    }
    return await this.userRepository.createUser(createUserDto)
  }

  async findUserByEmail(email: string): Promise<User> {
    if (!email) {
      throw new HttpException('Wrong data', HttpStatus.BAD_REQUEST)
    }

    return await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    })
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email'],
    })
    if (!user) {
      throw new NotFoundException('User with this ID not found')
    }
    return user
  }

  async findFullUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'password'],
    })
    if (!user) {
      throw new NotFoundException('User with this ID not found')
    }
    return user
  }

  async updateUser(updateUserDto: UpdateUserDto, id: string): Promise<User> {
    const user = await this.findUserById(id)

    return this.userRepository.save({ ...user, ...updateUserDto })
  }

  async isUserExist({ email }): Promise<boolean> {
    const user = await this.userRepository.findOne({ email })

    return !!user
  }
}
