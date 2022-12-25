import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { UserDTO } from './dtos/user.dto';
import { User } from './entities/user.entity';
import { UserUtils } from './user.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private userUtil: UserUtils,
  ) { }

  async createUser(user: UserDTO): Promise<User> {
    // hash password if provided available
    if (user.password) {
      const hashedPassword = await this.userUtil.hashPassword(user.password);
      user.password = hashedPassword;
    }

    // save user in the db
    const entity = await this.usersRepository.create(user);
    return this.usersRepository.save(entity);
  }

  async findByUsername(name: string) {
    return await this.usersRepository.findOne({
      where: { name },
    });
  }

  async findByEmail(email: string) {
    return getRepository(User)
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.createdAt',
        'user.updatedAt',
      ])
      .where('user.email = :email', { email })
      .getOne();
  }

  async findAllUsers() {
    try {
      return getRepository(User)
        .createQueryBuilder('user')
        .select([
          'user.id',
          'user.name',
          'user.email',
          'user.createdAt',
          'user.updatedAt',
        ])
        .getManyAndCount();
    } catch (error) {
      return error;
    }
  }
}
