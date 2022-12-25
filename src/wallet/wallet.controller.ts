import { UserDTO } from 'src/user/dtos/user.dto';
import { TopUpDTO } from './dtos/topup.dto';
import { WalletService } from './wallet.service';
import { TopUpValidation } from './validations/topup.validation';
import { AppHelper } from './../app.helper';
import { Request, Body, Controller, Post, Res, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { WalletConstant } from './constants/wallet.constants';
import { TransactionDTO } from './dtos/transaction.dto';

@Controller()
export class WalletController {

  constructor(
    private readonly appHelper: AppHelper,
    private readonly walletService: WalletService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post('/wallets/topUp')
  async topUp(@Request() req, @Body(TopUpValidation) payload, @Res() res) {
    // validate top up request
    const { error } = payload;
    if (error) return this.appHelper.badRequest(res, error.details[0].message);

    // get my wallet
    const user: UserDTO = req.user;
    let wallet = await this.walletService.findWalletByUserId(user.id);

    const topUpRequest: TopUpDTO = payload.value;
    const txn: TransactionDTO = {
      description: WalletConstant.DEPOSIT,
      type: WalletConstant.TOP_UP,
      amount: topUpRequest.amount,
      creditedWallet: wallet
    };

    // save transaction
    const savedTxn = await this.walletService.saveTransaction(txn);

    // update balance
    const newBalance = Number(topUpRequest.amount) + Number(wallet.balance);
    wallet = await this.walletService.updateBalance(wallet.id, newBalance);

    // return balance and transaction summary
    return this.appHelper.successRequest(res, {
      txnId: savedTxn['id'],
      txnDescription: savedTxn['description'],
      txnDate: savedTxn['createdAt'],
      balance: Number(wallet.balance)
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/wallets/balance')
  async getBalance(@Request() req, @Res() res) {
    // get my wallet
    const user: UserDTO = req.user;
    let wallet = await this.walletService.findWalletByUserId(user.id);

    // return balance
    return this.appHelper.successRequest(res, {
      balance: Number(wallet.balance)
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/wallets/transactions')
  async getTransactions(@Request() req, @Res() res) {
    const user: UserDTO = req.user;

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

    // return balance
    return this.appHelper.successRequest(res, { totalTransactions, foundTransactions });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/wallets')
  async getWallets(@Request() req, @Res() res) {
    const user: UserDTO = req.user;

    let foundWallets = [];
    let totalWallets = null;

    // get wallet
    if (user.isAdmin) {
      const [wallets, count] = await this.walletService.findWallets();
      foundWallets = wallets;
      totalWallets = count;

    } else {
      const wallet = await this.walletService.findWalletByUserId(user.id);
      foundWallets.push(wallet);
      totalWallets = 1;
    }

    return this.appHelper.successRequest(res, { totalWallets, foundWallets });
  }
}
