import { UserDTO } from "src/user/dtos/user.dto";

export interface TopUpDTO {
    user: UserDTO;
    amount: string;
}
