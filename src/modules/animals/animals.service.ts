import { handleDatabaseError } from 'src/helpers/database-error-helper';
import { CreateUpdateAnimalDto } from './dto/create-update-animal.dto';
import { PaginatedAnimalsDto } from './dto/paginated-animals.dto';
import { AnimalResponseDto } from './dto/animals-response.dto';
import { Injectable, ConflictException } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Animals } from './entities/animals.entity';
import { Repository } from 'typeorm';
import {
  throwIfNoEffect,
  throwIfNotFound,
} from 'src/helpers/throw-if-not-found.helper';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectRepository(Animals) private animalsRepository: Repository<Animals>,
  ) {}

  private async findByType(type: string): Promise<AnimalResponseDto | null> {
    return await this.animalsRepository.findOne({ where: { type } });
  }

  async findAll({
    page = 1,
    limit = 10,
  }: PaginationDto): Promise<PaginatedAnimalsDto> {
    const [data, total] = await this.animalsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { animals_id: 'ASC' },
    });

    return {
      items: data,
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<AnimalResponseDto> {
    const animal = await this.animalsRepository.findOne({
      where: { animals_id: id },
    });

    return throwIfNotFound(animal, 'Animal', id);
  }

  async create(newAnimal: CreateUpdateAnimalDto): Promise<AnimalResponseDto> {
    const existing = await this.findByType(newAnimal.type);

    if (existing)
      throw new ConflictException(`El animal (${newAnimal.type}) ya existe`);

    return await this.animalsRepository.save(newAnimal);
  }

  async update(
    id: number,
    newAnimal: CreateUpdateAnimalDto,
  ): Promise<AnimalResponseDto> {
    const toUpdate = await this.findById(id);

    return await handleDatabaseError(
      () =>
        this.animalsRepository.save({
          ...toUpdate,
          ...newAnimal,
        }),
      {
        conflictMessage: `Ya existe un animal con ese tipo (${newAnimal.type})`,
      },
    );
  }

  async delete(id: number) {
    const res = await this.animalsRepository.delete({
      animals_id: id,
    });

    throwIfNoEffect(res, 'Animal', id);
  }
}
