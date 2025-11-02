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

  private async findBy(
    key: string,
    value: any,
  ): Promise<PersonResponseDto | null> {
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

  async findById(id: number): Promise<PersonResponseDto> {
    const person = await this.findBy('persons_id', id);

    return throwIfNotFound(person, 'Persona', id);
  }

  async findByIdIncludingExtensions(
    id: number,
  ): Promise<PersonWithRelationsResponseDto> {
    const person = await this.personRepository.findOne({
      relations: ['naturalPerson'],
      where: { persons_id: id },
    });

    const res = plainToInstance(PersonWithRelationsResponseDto, person, {
      excludeExtraneousValues: true,
    });

    return throwIfNotFound(res, 'Persona', id);
  }

  async create(newPerson: CreatePersonDto): Promise<PersonResponseDto> {
    let existing = await this.findBy('phone', newPerson.phone);

    if (existing)
      throw new ConflictException(
        `El número de tlf ya se encuentra registrado (${newPerson.phone})`,
      );

    existing = await this.findBy('email', newPerson.email);

    if (existing)
      throw new ConflictException(
        `El email ya se encuentra registrado (${newPerson.email})`,
      );

    return await this.personRepository.save(newPerson);
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

  async update(
    id: number,
    newPerson: UpdatePersonDto,
  ): Promise<PersonResponseDto> {
    const toUpdate = await this.findById(id);

    if (newPerson.phone && newPerson.phone !== toUpdate.phone) {
      await validateUniqueField<PersonResponseDto>(
        'phone',
        newPerson.phone,
        toUpdate.phone,
        this.findBy.bind(this),
        (val) => `El número de teléfono ya se encuentra registrado (${val})`,
      );
    }

    if (newPerson.email && newPerson.email !== toUpdate.email) {
      await validateUniqueField<PersonResponseDto>(
        'email',
        newPerson.email,
        toUpdate.email,
        this.findBy.bind(this),
        (val) => `El email ya se encuentra registrado (${val})`,
      );
    }

    mergeDefined(toUpdate, newPerson);

    return await handleDatabaseError(
      async () => {
        const savedPerson = this.personRepository.save({
          ...toUpdate,
        });

        return plainToInstance(PersonResponseDto, savedPerson);
      },
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
