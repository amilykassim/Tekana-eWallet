import { UserService } from 'src/user/user.service';
import { Controller, Get, Res, UseGuards, Request } from '@nestjs/common';
import { AppHelper } from 'src/app.helper';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserDTO } from './dtos/user.dto';

@Controller()
export class UserController {
  constructor(
    private readonly appHelper: AppHelper,
    private readonly userService: UserService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('/users')
  async getWallets(@Request() req, @Res() res) {
    const user: UserDTO = req.user;

    let foundUsers = [];
    let totalUsers = null;

    if (user.isAdmin) {
      const [users, count] = await this.userService.findAllUsers();
      foundUsers = users;
      totalUsers = count;

    } else {
      const foundUser = await this.userService.findByEmail(user.email);
      foundUsers.push(foundUser);
      totalUsers = 1;
    }

    return this.appHelper.successRequest(res, { totalUsers, foundUsers });
  }
}
