import { PaginatedNaturalPersonsDto } from './dto/paginated-natural-persons.dto';
import { NaturalPersonResponseDto } from './dto/natural-person-response.dto';
import { CreateNaturalPersonDto } from './dto/create-natural-person.dto';
import { throwIfNotFound } from 'src/helpers/throw-if-not-found.helper';
import { UpdateNaturalPersonDto } from './dto/update-natural-person.dto';
import { handleDatabaseError } from 'src/helpers/database-error-helper';
import { NaturalPersons } from './entities/natural-persons.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PersonsService } from '../persons/persons.service';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { DataSource, Repository } from 'typeorm';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { mergeDefined } from 'src/helpers/merge-defined-helper';

@Injectable()
export class NaturalPersonsService {
  constructor(
    @InjectRepository(NaturalPersons)
    private naturalPersonsRepository: Repository<NaturalPersons>,
    private personsService: PersonsService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  private async findBy(
    key: string,
    value: any,
  ): Promise<NaturalPersonResponseDto | null> {
    return await this.naturalPersonsRepository.findOne({
      where: { [key]: value },
      relations: ['person'],
    });
  }

  async findAll({
    page = 1,
    limit = 10,
  }: PaginationDto): Promise<PaginatedNaturalPersonsDto> {
    try {
      const [data, total] = await this.naturalPersonsRepository.findAndCount({
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
    } catch (error) {
      console.error('Error in findAll:', error);
      throw new InternalServerErrorException('Error al obtener los datos');
    }
  }

  async findById(id: number): Promise<NaturalPersonResponseDto> {
    const person = await this.findBy('person_id', id);

    return throwIfNotFound(person, 'Persona Natural', id);
  }

  async create(
    newPerson: CreateNaturalPersonDto,
  ): Promise<NaturalPersonResponseDto> {
    const existing = await this.findBy('dni', newPerson.dni);

    if (existing)
      throw new ConflictException(
        `Existe una persona registrada con ese dni (${newPerson.dni})`,
      );

    const person = await this.personsService.create(newPerson.person);

    const natural = await this.naturalPersonsRepository.save({
      ...newPerson,
      person,
    });

    return plainToInstance(NaturalPersonResponseDto, natural);
  }

  async update(
    id: number,
    newPerson: UpdateNaturalPersonDto,
  ): Promise<NaturalPersonResponseDto> {
    const { person, ...natural } = newPerson;

    if (person) await this.personsService.update(id, person);

    const toUpdate = await this.findById(id);

    mergeDefined(toUpdate, natural);

    return await handleDatabaseError(
      async () => {
        const savedPerson = await this.naturalPersonsRepository.save({
          ...toUpdate,
        });

        return plainToInstance(NaturalPersonResponseDto, savedPerson);
      },
      {
        conflictMessage: `Ya existe una persona con ese dni (${newPerson.dni})`,
      },
    );
  }

  async delete(personId: number): Promise<any> {
    await this.findById(personId);
    await this.personsService.delete(personId);
  }
}
