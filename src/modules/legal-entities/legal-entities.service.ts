import { PaginatedLegalEntitiesDto } from './dto/paginated-legal-entities.dto';
import { LegalEntityResponseDto } from './dto/legal-entity-response.dto';
import { throwIfNotFound } from 'src/helpers/throw-if-not-found.helper';
import { CreateLegalEntityDto } from './dto/create-legal-entity.dto';
import { UpdateLegalEntityDto } from './dto/update-legal-entity.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { mergeDefined } from 'src/helpers/merge-defined-helper';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { LegalEntity } from './entities/legal-entity.entity';
import { PersonsService } from '../persons/persons.service';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { DataSource, Repository } from 'typeorm';
import {
  Delete,
  HttpCode,
  Injectable,
  ConflictException,
} from '@nestjs/common';

@Injectable()
export class LegalEntitiesService {
  constructor(
    @InjectRepository(LegalEntity)
    private legalEntityRepository: Repository<LegalEntity>,
    private personsService: PersonsService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  private async findBy(
    key: string,
    value: any,
  ): Promise<LegalEntityResponseDto | null> {
    return await this.legalEntityRepository.findOne({
      where: { [key]: value },
      relations: ['person'],
    });
  }

  async findAll({
    page = 1,
    limit = 10,
  }: PaginationDto): Promise<PaginatedLegalEntitiesDto> {
    const [data, total] = await this.legalEntityRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { person_id: 'ASC' },
      relations: ['person'],
    });

    const res = plainToInstance(LegalEntityResponseDto, data, {
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

  async findById(id: number): Promise<LegalEntityResponseDto> {
    const person = await this.findBy('person_id', id);

    const res = plainToInstance(LegalEntityResponseDto, person, {
      excludeExtraneousValues: true,
    });

    return throwIfNotFound(res, 'Persona Jurídica', id);
  }

  async create(newLegalEntity: CreateLegalEntityDto) {
    return await this.dataSource.transaction(async (manager) => {
      const existing = await manager.findOne(LegalEntity, {
        where: { rif: newLegalEntity.rif },
        relations: ['person'],
      });

      if (
        existing &&
        existing.person.taxpayer_type === newLegalEntity.person.taxpayer_type
      ) {
        throw new ConflictException(
          `Existe una persona jurídica con ese rif (${existing.person.taxpayer_type}${newLegalEntity.rif})`,
        );
      }

      const person = await this.personsService.createWithManager(
        manager,
        newLegalEntity.person,
      );

      const legalEntity = await manager.save(LegalEntity, {
        ...newLegalEntity,
        person,
      });

      return plainToInstance(LegalEntityResponseDto, legalEntity, {
        excludeExtraneousValues: true,
      });
    });
  }

  async update(
    id: number,
    newLegalEntity: UpdateLegalEntityDto,
  ): Promise<LegalEntityResponseDto> {
    return await this.dataSource.transaction(async (manager) => {
      const { person, ...legalEntity } = newLegalEntity;

      if (person)
        await this.personsService.updateWithManager(manager, id, person);

      const toUpdate = await manager.findOne(LegalEntity, {
        where: { person_id: id },
        relations: ['person'],
      });

      if (!toUpdate)
        throw new ConflictException(
          `Persona Jurídica con ID ${id} no encontrado`,
        );

      if (
        toUpdate.rif === legalEntity.rif &&
        toUpdate.person.taxpayer_type === person?.taxpayer_type
      )
        throw new ConflictException(
          `Existe una persona jurídica con ese rif (${person.taxpayer_type}${legalEntity.rif})`,
        );

      mergeDefined(toUpdate, legalEntity);

      const saved = await manager.save(LegalEntity, toUpdate);
      return plainToInstance(LegalEntityResponseDto, saved, {
        excludeExtraneousValues: true,
      });
    });
  }

  /**
   * @param {number} personId Id de la persona a eliminar
   */
  @Delete(':personId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar persona jurídica' })
  @ApiParam({
    name: 'personId',
    type: Number,
    required: true,
    description: 'ID de la persona',
    example: 10,
  })
  async delete(personId: number) {
    await this.findById(personId);
    await this.personsService.delete(personId);
  }
}
