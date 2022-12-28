import { Transaction } from './transaction.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, OneToMany } from "typeorm";
import { User } from './user.entity';

@Entity()
export class Wallet {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, (user) => user.wallet, { cascade: true })
    @JoinColumn()
    user: User

    @Column({ length: 13 })
    balance: string;

    @OneToMany(() => Transaction, (transaction) => transaction.creditedWallet)
    transactions: Transaction[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}