import { UserDTO } from "src/user/dtos/user.dto";

export interface WalletDTO {
    id?: string;
    user: UserDTO;
    balance: string;
}
