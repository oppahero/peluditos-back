import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { forwardRef, Module } from '@nestjs/common';
import { Service } from './entities/service.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetsModule } from '../pets/pets.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    forwardRef(() => AuthModule),
    PetsModule,
    UsersModule,
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
