import { NaturalPersonsController } from './natural-persons.controller';
import { NaturalPersonsService } from './natural-persons.service';
import { NaturalPerson } from './entities/natural-person.entity';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonsModule } from '../persons/persons.module';
import { Person } from '../persons/entities/person.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NaturalPerson, Person]),
    forwardRef(() => AuthModule),
    PersonsModule,
  ],
  controllers: [NaturalPersonsController],
  providers: [NaturalPersonsService],
})
export class NaturalPersonsModule {}
