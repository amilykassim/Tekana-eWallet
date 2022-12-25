import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { UserUtils } from './user.helper';
import { UserService } from './user.service';
require('dotenv').config();


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService, UserUtils],
  exports: [UserService]
})
export class UserModule { }
