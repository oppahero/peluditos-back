import { UsersModule } from 'src/modules/users/users.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './aut.controller';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '8h' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAuthGuard,
    // {
    //   provide: APP_GUARD,
    //   useClass: GlobalAccessGuard,
    // },
  ],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
