import { UserDTO } from "./user.dto";

export interface WalletDTO {
    id?: string;
    user: UserDTO;
    balance: string;
    trackId?: string;
}
