import { UserDTO } from 'src/user/dtos/user.dto';

export class GetWalletsEvent {
  constructor(
    public readonly payload: UserDTO,
  ) { }
}