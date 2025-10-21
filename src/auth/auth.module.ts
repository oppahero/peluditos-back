import { JwtConfigService } from 'src/config/jwt-config.service';
import { JwtConfigModule } from 'src/config/jwt-config.module';
import { UsersModule } from 'src/modules/users/users.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './aut.controller';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [AuthController],
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtConfigModule,
    JwtModule.registerAsync({
      imports: [JwtConfigModule],
      inject: [JwtConfigService],
      useFactory: async (
        jwtConfig: JwtConfigService,
      ): Promise<JwtModuleOptions> => ({
        secret: jwtConfig.secret,
        signOptions: {
          expiresIn: jwtConfig.expiresIn ?? '1d',
        },
      }),
    }),
    // JwtModule.register({
    //   secret: jwtConstants.secret,
    //   signOptions: { expiresIn: '8h' },
    // }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtAuthGuard,
    // {
    //   provide: APP_GUARD,
    //   useClass: GlobalAccessGuard,
    // },
  ],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
