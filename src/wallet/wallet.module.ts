import { Transaction } from './entities/transaction.entity';
import { WalletService } from './wallet.service';
import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
require('dotenv').config();


@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, Transaction]),
  ],
  controllers: [WalletController],
  providers: [WalletService, WalletService],
  exports: [WalletService]
})
export class WalletModule { }
