import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { UserUtils } from './user.helper';

@Controller()
export class UserController {
  private validatedUsers = [];

  constructor(
    private readonly userService: UserService,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('/users')
  async getUncommittedUsers(@Res() res) {
    const users = await this.validatedUsers;

    return res.status(200).json({ code: 200, data: users });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/users/committed')
  async getCommittedUsers(@Res() res) {
    const results = await this.userService.findAll();

    // remove password
    const users = results.map(({ password, ...users }) => users);

    return res.status(200).json({ code: 200, data: users });
  }
}
