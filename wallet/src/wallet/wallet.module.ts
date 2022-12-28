import { AppHelper } from './../app.helper';
import { Transaction } from './entities/transaction.entity';
import { WalletService } from './wallet.service';
import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { KafkaHelper } from 'src/helpers/kafka-helper';
require('dotenv').config();


@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, Transaction]),
  ],
  controllers: [WalletController],
  providers: [WalletService, WalletService, AppHelper, KafkaHelper],
  exports: [WalletService]
})
export class WalletModule { }
