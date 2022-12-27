import { UserDTO } from 'src/user/dtos/user.dto';

export class GetWalletsCommand {
  constructor(
    public readonly payload: UserDTO
  ) { }
}