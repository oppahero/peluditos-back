import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserResponseDto } from 'src/modules/users/dto/users.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  // @UseGuards(AuthGuard('local'))
  async login(@Request() req: { user: UserResponseDto }) {
    return this.authService.login(req.user);
  }
}
