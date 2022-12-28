import { WalletService } from './wallet.service';
import { KafkaHelper } from 'src/helpers/kafka-helper';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserDTO } from './dtos/user.dto';
import { WalletConstant } from './constants/wallet.constants';
import { TransactionDTO } from './dtos/transaction.dto';
@Controller()
export class WalletController {

  constructor(
    private readonly kafkaHelper: KafkaHelper,
    private readonly walletService: WalletService,

  ) { }

  @MessagePattern(process.env.WALLET_BALANCE_REQUEST_TOPIC)
  async getBalance(@Payload() { value }) {
    const user: UserDTO = value;
    let wallet = await this.walletService.findWalletByUserId(user.id);

    // send response to kafka and add trackid to each request to 
    // help us track the request/response across different microservices
    wallet['trackId'] = user.trackId;
    this.kafkaHelper.send(wallet, process.env.WALLET_BALANCE_RESPONSE_TOPIC);
  }

  @MessagePattern(process.env.WALLET_TOPUP_REQUEST_TOPIC)
  async topUp(@Payload() { value }) {
    const user: UserDTO = value.user;
    let wallet = await this.walletService.findWalletByUserId(user.id);

    const txn: TransactionDTO = {
      description: WalletConstant.DEPOSIT,
      type: WalletConstant.TOP_UP,
      amount: value.amount,
      creditedWallet: wallet
    };

    // save transaction
    const savedTxn = await this.walletService.saveTransaction(txn);

    // update balance
    const newBalance = Number(value.amount) + Number(wallet.balance);
    wallet = await this.walletService.updateBalance(wallet.id, newBalance);

    // send response to kafka
    const response = { trackId: user.trackId, transaction: savedTxn, wallet }
    this.kafkaHelper.send(response, process.env.WALLET_TOPUP_RESPONSE_TOPIC);
  }

  @MessagePattern(process.env.WALLET_TRANSACTIONS_REQUEST_TOPIC)
  async getTransactions(@Payload() { value }) {
    const user: UserDTO = value;

    let foundTransactions = [];
    let totalTransactions = null;

    // if user is admin get all transactions, otherwise get only the transactions of the authenticated user
    if (user.isAdmin) {
      let [transactions, count] = await this.walletService.findTransactions();
      foundTransactions = transactions;
      totalTransactions = count;

    } else {
      const wallet = await this.walletService.findWalletByUserId(user.id);
      let [transactions, count] = await this.walletService.findTransactionsByWallet(wallet);
      foundTransactions = transactions;
      totalTransactions = count;
    }

    // send response to kafka
    const response = { trackId: user.trackId, totalTransactions, foundTransactions };
    this.kafkaHelper.send(response, process.env.WALLET_TRANSACTIONS_RESPONSE_TOPIC);
  }

  @MessagePattern(process.env.WALLET_GET_WALLETS_REQUEST_TOPIC)
  async getWallets(@Payload() { value }) {
    const user: UserDTO = value;

    let foundWallets = [];
    let totalWallets = null;

    // get all wallets if you're an admin, otherwise return only the authenticated user wallet
    if (user.isAdmin) {
      const [wallets, count] = await this.walletService.findWallets();
      foundWallets = wallets;
      totalWallets = count;

    } else {
      const wallet = await this.walletService.findWalletByUserId(user.id);
      foundWallets.push(wallet);
      totalWallets = 1;
    }

    // send response to kafka
    const response = { trackId: user.trackId, totalWallets, foundWallets };
    this.kafkaHelper.send(response, process.env.WALLET_GET_WALLETS_RESPONSE_TOPIC);
  }
}
