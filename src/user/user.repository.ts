import { EntityRepository, Repository } from 'typeorm'
import { User } from './user.entity'

import { CreateUserDto } from './dto/create-user.dto'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.create({ ...createUserDto })
    return await this.save(user)
  }
}
