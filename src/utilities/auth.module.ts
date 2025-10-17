import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt', //Este jwt es el que se indicara en las rutas protegidas
      property: 'user',
      session: false,
    }),
  ],
  controllers: [],
  providers: [JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
