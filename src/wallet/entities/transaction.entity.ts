import { Wallet } from '../../wallet/entities/wallet.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, ManyToOne, Index } from "typeorm";

@Entity()
export class Transaction {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 13 })
    description: string;

    @ManyToOne(() => Wallet, (wallet) => wallet.transactions, { onDelete: 'CASCADE' })
    creditedWallet: Wallet;

    @Index("IDX_transaction_amount", { synchronize: false })
    @Column({ length: 13 })
    amount: string;

    @Column({ length: 25 })
    type: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}