import { UserDTO } from 'src/user/dtos/user.dto';

export class WalletTransactionsCommand {
  constructor(
    public readonly payload: UserDTO
  ) { }
}