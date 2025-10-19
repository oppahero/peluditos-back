import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalsModule } from './modules/animals/animals.module';
import { configService } from './config/config.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AnimalsModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
