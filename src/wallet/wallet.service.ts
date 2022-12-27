import { Wallet } from 'src/wallet/entities/wallet.entity';
import { WalletDTO } from './dtos/wallet.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletsRepository: Repository<Wallet>,
  ) { }

  async createWallet(wallet: WalletDTO): Promise<Wallet> {
    const entity = await this.walletsRepository.create(wallet);
    return this.walletsRepository.save(entity);
  }
}
