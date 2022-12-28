import { WalletService } from './../wallet/wallet.service';
import { LoginValidation } from './validations/login.validation';
import { AppHelper } from './../app.helper';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterUserValidation } from '../auth/validations/register.validation';
import { AuthService } from './auth.service';
import { UserDTO } from 'src/user/dtos/user.dto';
import { WalletDTO } from 'src/wallet/dtos/wallet.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly appHelper: AppHelper,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly walletService: WalletService,
  ) { }

  @Post('/auth/login')
  async login(@Body(LoginValidation) request, @Res() res) {

    // validate request
    const { error } = request;
    if (error) return this.appHelper.badRequest(res, error.details[0].message);

    // check if email is valid
    const { email, password } = request.value;
    const searchedUser = await this.authService.findUser(email);
    if (!searchedUser) return this.appHelper.badRequest(res, 'Invalid email or password');

    // check if password is valid
    const isValid = await this.authService.comparePassword(password, searchedUser.password);
    if (!isValid) return this.appHelper.badRequest(res, 'Invalid email or password');

    // authenticate the user and return a token
    const { access_token } = await this.authService.login(searchedUser);
    return this.appHelper.successRequest(res, { access_token });
  }

  @Post('/auth/register')
  async register(@Body(RegisterUserValidation) request, @Res() res) {

    // validate register request
    const { error } = request;
    if (error) return this.appHelper.badRequest(res, error.details[0].message);

    // check if email is unique
    const userPayload = request.value;
    let userFound = await this.userService.findByEmail(userPayload.email);
    if (userFound) return this.appHelper.badRequest(res, 'Email is already taken, try another one');

    // create user account
    userPayload.isAdmin = false;
    const createdUser: UserDTO = await this.userService.createUser(userPayload);
    const { password, ...user } = createdUser;

    // create wallet
    const wallet: WalletDTO = { user: createdUser, balance: '0' };
    const savedWallet = await this.walletService.createWallet(wallet);

    // authenticate the user and return a token
    const { access_token } = await this.authService.login(user);
    return this.appHelper.successRequest(res, { user, access_token }, 201)
  }
}
