import {
  Controller,
  Post,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserResponseDto } from 'src/modules/users/dto/users-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   *
   * @returns {accessToken: string} Devuelve token de autentización
   * @param {Request} res Datos del usuario
   */
  @Post('login')
  @ApiOperation({ summary: 'Autenticación de usuario' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    example: {
      user: {
        users_id: 9,
        username: 'sirlzn',
        rol: 'Veterinario',
      },
      accessToken: 'eyJhbGciOiJIUzI1Ni',
    },
  })
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: { user: UserResponseDto }, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user,
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // true solo en HTTPS
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });

    return res.json({ user: req.user, accessToken });
  }

  @Post('refresh') async refresh(@Request() req: any, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) throw new UnauthorizedException('No hay refresh token');

    const tokens = await this.authService.refreshTokens(refreshToken);

    return res.json({ accessToken: tokens.accessToken });
  }
}
