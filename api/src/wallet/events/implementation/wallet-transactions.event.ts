import { UserDTO } from 'src/user/dtos/user.dto';

export class WalletTransactionsEvent {
  constructor(
    public readonly payload: UserDTO,
  ) { }
}