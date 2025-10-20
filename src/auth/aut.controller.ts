import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { UserResponseDto } from 'src/modules/users/dto/users.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   *
   * @returns {access_token: string} Devuelve token de autentización
   * @param {Request} res Datos del usuario
   */
  @Post('login')
  @ApiOperation({ summary: 'Autenticación de usuario' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Token de acceso generado correctamente',
    example: {
      access_token: 'lkaskanklsnalkññalkasjkjalks',
    },
  })
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: { user: UserResponseDto }) {
    return this.authService.login(req.user);
  }
}
