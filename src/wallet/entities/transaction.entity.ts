import { Wallet } from 'src/wallet/entities/wallet.entity';
import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne } from "typeorm";

@Entity()
export class Transaction {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 13 })
    description: string;

    @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
    creditedWallet: Wallet;

    @Column({ length: 13 })
    amount: string;

    @Column({ length: 25 })
    type: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}