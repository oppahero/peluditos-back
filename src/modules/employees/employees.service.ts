import { NaturalPerson } from '../natural-persons/entities/natural-person.entity';
import { throwIfNotFound } from 'src/helpers/throw-if-not-found.helper';
import { PaginatedEmployeesDto } from './dto/paginated-employees.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { EmployeeResponseDto } from './dto/employee-response.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PersonsService } from '../persons/persons.service';
import { Employee } from './entities/employee.entity';
import { plainToInstance } from 'class-transformer';
import { DataSource, Repository } from 'typeorm';
import { NaturalPersonsService } from '../natural-persons/natural-persons.service';
import { mergeDefined } from 'src/helpers/merge-defined-helper';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private personsService: PersonsService,
    private maturalPersonsService: NaturalPersonsService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  private async findBy(
    key: string,
    value: any,
  ): Promise<EmployeeResponseDto | null> {
    return await this.employeeRepository.findOne({
      where: { [key]: value },
      relations: ['natural_person', 'natural_person.person'],
    });
  }

  async findAll({
    page = 1,
    limit = 10,
  }: PaginationDto): Promise<PaginatedEmployeesDto> {
    const [data, total] = await this.employeeRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { person_id: 'ASC' },
      relations: ['natural_person', 'natural_person.person'],
    });

    const res = plainToInstance(EmployeeResponseDto, data, {
      excludeExtraneousValues: true,
    });

    return {
      items: res,
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<EmployeeResponseDto> {
    const person = await this.findBy('person_id', id);

    const res = plainToInstance(EmployeeResponseDto, person, {
      excludeExtraneousValues: true,
    });

    return throwIfNotFound(res, 'Empleado', id);
  }

  async createWithManager(
    newEmployee: CreateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    return await this.dataSource.transaction(async (manager) => {
      const dni = newEmployee.natural_person.dni;
      const existing = await manager.findOne(NaturalPerson, { where: { dni } });

      if (existing) {
        throw new ConflictException(
          `Existe una persona registrada con ese dni ${dni}`,
        );
      }

      const person = await this.personsService.createWithManager(
        manager,
        newEmployee.natural_person.person,
      );

      let naturalPerson = manager.create(NaturalPerson, {
        ...newEmployee.natural_person,
        person,
      });

      naturalPerson = await manager.save(naturalPerson);

      const employee = manager.create(Employee, {
        ...newEmployee,
        person_id: naturalPerson.person_id,
        natural_person: naturalPerson,
      });
      await manager.save(employee);

      return plainToInstance(EmployeeResponseDto, employee, {
        excludeExtraneousValues: true,
      });
    });
  }

  async updateWithManager(
    id: number,
    newEmployee: UpdateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    return await this.dataSource.transaction(async (manager) => {
      const { natural_person, ...employee } = newEmployee;

      await this.maturalPersonsService.updateWithManager(
        manager,
        id,
        natural_person,
      );

      const toUpdate = await manager.findOne(Employee, {
        where: { person_id: id },
        relations: ['natural_person', 'natural_person.person'],
      });

      if (!toUpdate)
        throw new ConflictException(`Empleado con ID ${id} no encontrado`);

      mergeDefined(toUpdate, employee);

      const res = await manager.save(Employee, toUpdate);

      return plainToInstance(EmployeeResponseDto, res, {
        excludeExtraneousValues: true,
      });
    });
  }

  async delete(id: number) {
    await this.findById(id);
    await this.personsService.delete(id);
  }
}
