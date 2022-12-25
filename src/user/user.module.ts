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
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'amilykadyl',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'RSSB',
      entities: [
        User,
      ],
      synchronize: true
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserUtils],
  exports: [UserService]
})
export class UserModule { }
