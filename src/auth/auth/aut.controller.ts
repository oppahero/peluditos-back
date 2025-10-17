import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  // @UseGuards(AuthGuard('local'))

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: Express.Request) {
    return req.user;
  }
}
