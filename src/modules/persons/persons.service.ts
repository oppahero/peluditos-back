import { validateUniqueField } from 'src/helpers/validate-unique-field.helper';
import { handleDatabaseError } from 'src/helpers/database-error-helper';
import { PaginatedPersonsDto } from './dto/paginated-persons.dto';
import { mergeDefined } from 'src/helpers/merge-defined-helper';
import { ConflictException, Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { plainToInstance } from 'class-transformer';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import {
  PersonResponseDto,
  PersonWithRelationsResponseDto,
} from './dto/person-response.dto';
import {
  throwIfNoEffect,
  throwIfNotFound,
} from 'src/helpers/throw-if-not-found.helper';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Person) private personRepository: Repository<Person>,
  ) {}

  private async findBy(key: string, value: any): Promise<Person | null> {
    return await this.personRepository.findOneBy({ [key]: value });
  }

  async findAll({
    page = 1,
    limit = 10,
  }: PaginationDto): Promise<PaginatedPersonsDto> {
    const [data, total] = await this.personRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { persons_id: 'ASC' },
    });

    return {
      items: data,
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findEntityById(id: number): Promise<Person> {
    const person = await this.findBy('persons_id', id);
    return throwIfNotFound(person, 'Persona', id);
  }

  async findById(id: number): Promise<PersonResponseDto> {
    return await this.findEntityById(id);
  }

  async findByIdIncludingExtensions(
    id: number,
  ): Promise<PersonWithRelationsResponseDto> {
    const person = await this.personRepository.findOne({
      relations: ['naturalPerson', 'legalEntity'],
      where: { persons_id: id },
    });

    const res = plainToInstance(PersonWithRelationsResponseDto, person, {
      excludeExtraneousValues: true,
    });

    return throwIfNotFound(res, 'Persona', id);
  }

  async createWithManager(
    manager: EntityManager,
    dto: CreatePersonDto,
  ): Promise<Person> {
    const repo = manager.getRepository(Person);

    const existingPhone = await repo.findOne({ where: { phone: dto.phone } });

    if (existingPhone) {
      throw new ConflictException(
        `El número de tlf ya se encuentra registrado (${dto.phone})`,
      );
    }

    const existingEmail = await repo.findOne({ where: { email: dto.email } });
    if (existingEmail) {
      throw new ConflictException(
        `El email ya se encuentra registrado (${dto.email})`,
      );
    }

    const person = repo.create(dto);
    return await repo.save(person);
  }

  async updateWithManager(
    manager: EntityManager,
    id: number,
    dto: UpdatePersonDto,
  ): Promise<Person> {
    const repo = manager.getRepository(Person);
    let toUpdate = await repo.findOne({ where: { persons_id: id } });

    toUpdate = throwIfNotFound(toUpdate, 'Persona', id);

    if (dto.phone && dto.phone !== toUpdate?.phone) {
      await validateUniqueField<PersonResponseDto>(
        'phone',
        dto.phone,
        toUpdate.phone,
        this.findBy.bind(this),
        (val) => `El número de teléfono ya se encuentra registrado (${val})`,
      );
    }

    if (dto.email && dto.email !== toUpdate?.email) {
      await validateUniqueField<PersonResponseDto>(
        'email',
        dto.email,
        toUpdate.email,
        this.findBy.bind(this),
        (val) => `El email ya se encuentra registrado (${val})`,
      );
    }

    mergeDefined(toUpdate, dto);

    return await handleDatabaseError(
      async () => await manager.save(Person, toUpdate),
      {
        conflictMessage: `Error al actualizar la persona.`,
      },
    );
  }

  async delete(id: number) {
    const res = await this.personRepository.delete({
      persons_id: id,
    });

    throwIfNoEffect(res, 'Persona', id);
  }
}
