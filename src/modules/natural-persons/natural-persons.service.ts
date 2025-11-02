import { PaginatedNaturalPersonsDto } from './dto/paginated-natural-persons.dto';
import { NaturalPersonResponseDto } from './dto/natural-person-response.dto';
import { CreateNaturalPersonDto } from './dto/create-natural-person.dto';
import { throwIfNotFound } from 'src/helpers/throw-if-not-found.helper';
import { UpdateNaturalPersonDto } from './dto/update-natural-person.dto';
import { handleDatabaseError } from 'src/helpers/database-error-helper';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { NaturalPerson } from './entities/natural-person.entity';
import { mergeDefined } from 'src/helpers/merge-defined-helper';
import { Injectable, ConflictException } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PersonsService } from '../persons/persons.service';
import { plainToInstance } from 'class-transformer';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class NaturalPersonsService {
  constructor(
    @InjectRepository(NaturalPerson)
    private naturalPersonRepository: Repository<NaturalPerson>,
    private personsService: PersonsService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  private async findBy(
    key: string,
    value: any,
  ): Promise<NaturalPersonResponseDto | null> {
    return await this.naturalPersonRepository.findOne({
      where: { [key]: value },
      relations: ['person'],
    });
  }

  async findAll({
    page = 1,
    limit = 10,
  }: PaginationDto): Promise<PaginatedNaturalPersonsDto> {
    const [data, total] = await this.naturalPersonRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { person_id: 'ASC' },
      relations: ['person'],
    });

    return {
      items: data,
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<NaturalPersonResponseDto> {
    const person = await this.findBy('person_id', id);

    return throwIfNotFound(person, 'Persona Natural', id);
  }

  async create(
    newPerson: CreateNaturalPersonDto,
  ): Promise<NaturalPersonResponseDto> {
    return await this.dataSource.transaction(async (manager) => {
      const existing = await manager.findOne(NaturalPerson, {
        where: { dni: newPerson.dni },
      });

      if (existing) {
        throw new ConflictException(
          `Existe una persona registrada con ese dni (${newPerson.dni})`,
        );
      }

      const person = await this.personsService.createWithManager(
        manager,
        newPerson.person,
      );

      const natural = await manager.save(NaturalPerson, {
        ...newPerson,
        person,
      });

      return plainToInstance(NaturalPersonResponseDto, natural);
    });
  }

  async update(
    id: number,
    newPerson: UpdateNaturalPersonDto,
  ): Promise<NaturalPersonResponseDto> {
    const { person, ...natural } = newPerson;

    return await this.dataSource.transaction(async (manager) => {
      if (person) {
        await this.personsService.updateWithManager(manager, id, person);
      }

      const toUpdate = await manager.findOne(NaturalPerson, {
        where: { person_id: id },
        relations: ['person'],
      });

      if (!toUpdate) {
        throw new ConflictException(
          `Persona Natural con ID ${id} no encontrado`,
        );
      }

      mergeDefined(toUpdate, natural);

      const savedPerson = await handleDatabaseError(
        async () => await manager.save(NaturalPerson, toUpdate),
        {
          conflictMessage: `Ya existe una persona con ese dni (${newPerson.dni})`,
        },
      );

      return plainToInstance(NaturalPersonResponseDto, savedPerson, {
        excludeExtraneousValues: true,
      });
    });
  }

  async delete(id: number) {
    await this.findById(id);
    await this.personsService.delete(id);
  }
}
