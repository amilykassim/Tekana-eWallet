import { TopUpDTO } from './../../dtos/topup.dto';

export class WalletTopUpCommand {
  constructor(
    public readonly payload: TopUpDTO
  ) { }
}