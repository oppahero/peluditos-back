import { NaturalPerson } from '../natural-persons/entities/natural-person.entity';
import { NaturalPersonsModule } from '../natural-persons/natural-persons.module';
import { EmployeesController } from './employees.controller';
import { PersonsModule } from '../persons/persons.module';
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';
import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, NaturalPerson]),
    forwardRef(() => AuthModule),
    NaturalPersonsModule,
    PersonsModule,
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
