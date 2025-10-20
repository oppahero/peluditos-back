import { UserResponseDto } from 'src/modules/users/dto/users.dto';
import { UsersService } from 'src/modules/users/users.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<UserResponseDto | null> {
    const user = await this.usersService.findByUsername(username);
    if (!user) return null;

    const isMatch = await bcrypt.compare(pass, user.password);

    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: UserResponseDto) {
    const payload = { username: user.username, sub: user.users_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
