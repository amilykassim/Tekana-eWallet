import { TopUpDTO } from './../../dtos/topup.dto';

export class WalletTopUpEvent {
  constructor(
    public readonly payload: TopUpDTO,
  ) { }
}