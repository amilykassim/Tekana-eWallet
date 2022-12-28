import { WalletDTO } from 'src/wallet/dtos/wallet.dto';

export interface TransactionDTO {
    id?: string;
    description: string;
    creditedWallet: WalletDTO;
    amount: string;
    type: string;
    createdAt?: Date;
    updatedAt?: Date;
    trackId?: string;
}
