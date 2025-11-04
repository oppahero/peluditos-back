import { TypesOfServicesModule } from './modules/types-of-services/types-of-services.module';
import { NaturalPersonsModule } from './modules/natural-persons/natural-persons.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { DatabaseConfigService } from './config/database.service';
import { PersonsModule } from './modules/persons/persons.module';
import { AnimalsModule } from './modules/animals/animals.module';
import { DatabaseConfigModule } from './config/database.module';
import { BreedsModule } from './modules/breeds/breeds.module';
import { UsersModule } from './modules/users/users.module';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { LegalEntitiesModule } from './modules/legal-entities/legal-entities.module';
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
    BreedsModule,
    TypesOfServicesModule,
    PersonsModule,
    NaturalPersonsModule,
    EmployeesModule,
    LegalEntitiesModule,
    // TypeOrmModule.forRoot(configService.getTypeOrmConfig()),  con dotenv
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
