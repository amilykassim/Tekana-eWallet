import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async findUser(email: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user) return user;
    return null;
  }

  comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  async login(user: any) {
    const { id, email, username } = user;
    const payload = { sub: id, email, username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
