import { UserResponseDto } from 'src/modules/users/dto/users-response.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<UserResponseDto> {
    const user = await this.authService.validateUser(username, password);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    return user;
  }
}
