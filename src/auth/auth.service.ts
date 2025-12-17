import { UserResponseDto } from 'src/modules/users/dto/users-response.dto';
import { UsersService } from 'src/modules/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtConfigService } from 'src/config/jwt-config.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private jwtConfigService: JwtConfigService,
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
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  async generateAccessToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.jwtConfigService.secret,
      expiresIn: this.jwtConfigService.expiresIn,
    });
  }

  async generateRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.jwtConfigService.refreshSecret,
      expiresIn: this.jwtConfigService.refreshExpiresIn,
    });
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.jwtConfigService.refreshSecret,
      });

      const accessToken = await this.generateAccessToken({
        sub: payload.sub,
        username: payload.username,
      });

      return { accessToken };
    } catch (e) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }
}
