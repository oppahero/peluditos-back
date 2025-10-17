import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalsModule } from './modules/animals/animals.module';
import { configService } from './config/config.service';
import { AuthModule } from './auth/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    AnimalsModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
