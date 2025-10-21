import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalsModule } from './modules/animals/animals.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfigModule } from './config/database.module';
import { DatabaseConfigService } from './config/database.service';
import * as Joi from 'joi';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AnimalsModule,
    DatabaseConfigModule,
    // Para cargar congiguraciones de entorno
    ConfigModule.forRoot({
      isGlobal: true, // para no tener que importarlo en cada módulo
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default('1d'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [DatabaseConfigModule],
      inject: [DatabaseConfigService],
      useFactory: async (dbConfig: DatabaseConfigService) =>
        dbConfig.getTypeOrmConfig(),
    }),
    // TypeOrmModule.forRoot(configService.getTypeOrmConfig()),  con dotenv
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
