import { Transaction } from './wallet/entities/transaction.entity';
import { Wallet } from './wallet/entities/wallet.entity';
import { WalletModule } from './wallet/wallet.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'amilykadyl',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'RSSB',
      entities: [
        User,
        Wallet,
        Transaction
      ],
      synchronize: true,
      keepConnectionAlive: true
    }),

    AuthModule,
    UserModule,
    WalletModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
