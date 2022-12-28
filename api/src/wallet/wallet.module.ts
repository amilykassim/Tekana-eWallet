import { PollingHelper } from './../helpers/polling.helper';
import { RedisHelper } from './../helpers/redis-helper';
import { AppHelper } from './../app.helper';
import { Transaction } from './entities/transaction.entity';
import { WalletService } from './wallet.service';
import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { KafkaHelper } from 'src/helpers/kafka-helper';
import { CommandHandlers } from './commands/handlers';
import { EventHandlers } from './events/handlers';
import { CqrsModule } from '@nestjs/cqrs';
require('dotenv').config();


@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Wallet, Transaction]),
  ],
  controllers: [WalletController],
  providers: [
    WalletService,
    WalletService,
    AppHelper,
    KafkaHelper,
    RedisHelper,
    PollingHelper,
    ...CommandHandlers,
    ...EventHandlers
  ],
  exports: [WalletService]
})
export class WalletModule { }
