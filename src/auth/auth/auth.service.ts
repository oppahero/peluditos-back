import { UserResponseDto } from 'src/modules/users/dto/users.dto';
import { UsersService } from 'src/modules/users/users.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

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
}
