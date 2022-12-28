import { UserDTO } from './../../../user/dtos/user.dto';

export class WalletBalanceEvent {
  constructor(
    public readonly user: UserDTO,
  ) { }
}