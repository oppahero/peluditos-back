import { NaturalPersonsController } from './natural-persons.controller';
import { NaturalPersonsService } from './natural-persons.service';
import { NaturalPersons } from './entities/natural-persons.entity';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonsModule } from '../persons/persons.module';
import { Persons } from '../persons/entities/persons.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NaturalPersons, Persons]),
    forwardRef(() => AuthModule),
    PersonsModule,
  ],
  controllers: [NaturalPersonsController],
  providers: [NaturalPersonsService],
})
export class NaturalPersonsModule {}
