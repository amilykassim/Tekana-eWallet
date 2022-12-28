import { GetWalletsCommand } from './commands/implementation/wallet-get-wallets.command';
import { WalletTransactionsCommand } from './commands/implementation/wallet-transactions.command';
import { WalletTopUpCommand } from './commands/implementation/wallet-topup.command';
import { PollingHelper } from './../helpers/polling.helper';
import { WalletBalanceCommand } from './commands/implementation/wallet-balance.command';
import { UserDTO } from 'src/user/dtos/user.dto';
import { TopUpDTO } from './dtos/topup.dto';
import { TopUpValidation } from './validations/topup.validation';
import { AppHelper } from './../app.helper';
import { Request, Body, Controller, Post, Res, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';

@Controller()
export class WalletController {

  constructor(
    private readonly commandBus: CommandBus,
    private readonly appHelper: AppHelper,
    private readonly polling: PollingHelper,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('/wallets/balance')
  async getBalance(@Request() req, @Res() res) {
    const user: UserDTO = req.user;
    user.trackId = uuidv4();

    // dispatch wallet balance command to get balance
    await this.commandBus.execute(new WalletBalanceCommand(user));

    // poll from redis balance response from wallet microservice
    const wallet = await this.polling.poll(user.trackId);

    // return balance to the user
    return this.appHelper.successRequest(res, { balance: Number(wallet.balance) });
  }

  @UseGuards(JwtAuthGuard)
  @Post('/wallets/topUp')
  async topUp(@Request() req, @Body(TopUpValidation) payload, @Res() res) {
    // validate top up request
    const { error } = payload;
    if (error) return this.appHelper.badRequest(res, error.details[0].message);

    // add trackid to each user request to help us track the request/response across different microservices
    const user: UserDTO = req.user;
    user.trackId = uuidv4();

    // dispatch top up command to add money on your wallet
    const topUpRequest: TopUpDTO = { user, amount: payload.value.amount };
    await this.commandBus.execute(new WalletTopUpCommand(topUpRequest));

    // poll from redis topup response from wallet microservice
    const { transaction, wallet } = await this.polling.poll(user.trackId);

    // return balance and transaction summary
    return this.appHelper.successRequest(res, {
      txnId: transaction['id'],
      txnDescription: transaction['description'],
      txnDate: transaction['createdAt'],
      balance: Number(wallet.balance)
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/wallets/transactions')
  async getTransactions(@Request() req, @Res() res) {
    // add trackid to each user request to help us track the request/response across different microservices
    const user: UserDTO = req.user;
    user.trackId = uuidv4();

    // dispatch transactions command to get all txns on your wallet
    await this.commandBus.execute(new WalletTransactionsCommand(user));

    // poll from redis transactions response from wallet microservice
    const { totalTransactions, foundTransactions } = await this.polling.poll(user.trackId);

    // return transactions
    return this.appHelper.successRequest(res, { totalTransactions, foundTransactions });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/wallets')
  async getWallets(@Request() req, @Res() res) {
    const user: UserDTO = req.user;
    user.trackId = uuidv4();

    // dispatch get wallets command to get all wallets from wallet microservice
    await this.commandBus.execute(new GetWalletsCommand(user));

    // poll from redis wallets response from wallet microservice
    const { totalWallets, foundWallets } = await this.polling.poll(user.trackId);

    // return wallets
    return this.appHelper.successRequest(res, { totalWallets, foundWallets });
  }

  @MessagePattern(process.env.WALLET_BALANCE_RESPONSE_TOPIC)
  async listenToBalanceResponse(@Payload() { value }) {
    await this.polling.setData(value.trackId, value);
  }

  @MessagePattern(process.env.WALLET_TOPUP_RESPONSE_TOPIC)
  async listenToTopUpResponse(@Payload() { value }) {
    await this.polling.setData(value.trackId, value);
  }

  @MessagePattern(process.env.WALLET_TRANSACTIONS_RESPONSE_TOPIC)
  async listenToTransactionsResponse(@Payload() { value }) {
    await this.polling.setData(value.trackId, value);
  }

  @MessagePattern(process.env.WALLET_GET_WALLETS_RESPONSE_TOPIC)
  async listenToGetWalletsResponse(@Payload() { value }) {
    await this.polling.setData(value.trackId, value);
  }
}
