import { forwardRef, Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { AuthModule } from 'src/auth/auth.module';
import { BreedsModule } from '../breeds/breeds.module';
import { PersonsModule } from '../persons/persons.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pet]),
    forwardRef(() => AuthModule),
    BreedsModule,
    PersonsModule,
  ],
  controllers: [PetsController],
  providers: [PetsService],
  exports: [PetsService],
})
export class PetsModule {}
