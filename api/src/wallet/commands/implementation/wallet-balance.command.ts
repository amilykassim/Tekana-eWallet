import { UserDTO } from "src/user/dtos/user.dto";

export class WalletBalanceCommand {
  constructor(
    public readonly user: UserDTO
  ) { }
}