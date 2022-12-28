import { Transaction } from './entities/transaction.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { WalletDTO } from './dtos/wallet.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletsRepository: Repository<Wallet>,

    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) { }

  async createWallet(wallet: WalletDTO): Promise<Wallet> {
    const entity = await this.walletsRepository.create(wallet);
    return this.walletsRepository.save(entity);
  }

  async findWalletByUserId(userId: string): Promise<Wallet> {
    try {
      return getRepository(Wallet)
        .createQueryBuilder('wallet')
        .select([
          'wallet.id',
          'wallet.balance',
          'wallet.userId',
          'wallet.createdAt',
          'wallet.updatedAt',
        ])
        .where('wallet.userId = :userId', { userId })
        .getOne();
    } catch (error) {
      return error;
    }
  }

  async findWallets() {
    try {
      return getRepository(Wallet)
        .createQueryBuilder('wallet')
        .select([
          'wallet.id',
          'wallet.balance',
          'wallet.userId',
          'wallet.createdAt',
          'wallet.updatedAt',
        ])
        .getManyAndCount();
    } catch (error) {
      return error;
    }
  }


  async findTransactions() {
    try {
      return getRepository(Transaction)
        .createQueryBuilder('transaction')
        .select([
          'transaction.id',
          'transaction.description',
          'transaction.amount',
          'transaction.type',
          'transaction.creditedWalletId',
          'transaction.createdAt',
          'transaction.updatedAt',
        ])
        .getManyAndCount();
    } catch (error) {
      return error;
    }
  }

  async findTransactionsByWallet(wallet: WalletDTO) {
    try {
      return getRepository(Transaction)
        .createQueryBuilder('transaction')
        .select([
          'transaction.id',
          'transaction.description',
          'transaction.amount',
          'transaction.type',
          'transaction.creditedWalletId',
          'transaction.createdAt',
          'transaction.updatedAt',
        ])
        .where('transaction.creditedWalletId = :creditedWalletId', { creditedWalletId: wallet.id })
        .getManyAndCount();
    } catch (error) {
      return error;
    }
  }

  async updateBalance(id, amount) {
    const result = await getRepository(Wallet)
      .createQueryBuilder('wallet')
      .update(Wallet)
      .set({ balance: amount })
      .where("id = :id", { id })
      .execute();

    return this.findWalletById(id);
  }

  async findWalletById(id) {
    return getRepository(Wallet)
      .createQueryBuilder('wallet')
      .select([
        'wallet.id',
        'wallet.balance',
        'wallet.userId',
        'wallet.createdAt',
        'wallet.updatedAt',
      ])
      .where("id = :id", { id })
      .getOne()
  }

  async saveTransaction(txn) {
    // add transaction
    const entity = await this.transactionsRepository.create(txn);
    return this.transactionsRepository.save(entity);
  }
}
