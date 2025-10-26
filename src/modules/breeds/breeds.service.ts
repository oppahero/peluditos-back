import { handleDatabaseError } from 'src/helpers/database-error-helper';
import { PaginatedBreedsDto } from './dto/paginated-breeds.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { BreedResponseDto } from './dto/breed-response.dto';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Breeds } from './entities/breeds.entity';
import { Repository } from 'typeorm';
import {
  throwIfNoEffect,
  throwIfNotFound,
} from 'src/helpers/throw-if-not-found.helper';

@Injectable()
export class BreedsService {
  constructor(
    @InjectRepository(Breeds) private breedsRepository: Repository<Breeds>,
  ) {}

  async findAll({
    page = 1,
    limit = 10,
  }: PaginationDto): Promise<PaginatedBreedsDto> {
    const [data, total] = await this.breedsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { breeds_id: 'ASC' },
    });

    return {
      items: data,
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<BreedResponseDto> {
    const breed = await this.breedsRepository.findOne({
      where: { breeds_id: id },
    });

    return throwIfNotFound(breed, 'Raza', id);
  }

  async findByAnimalId(animalId: number): Promise<BreedResponseDto[]> {
    return await this.breedsRepository.find({
      where: { animal: { animals_id: animalId } },
    });
  }

  async create(newBreed: CreateBreedDto): Promise<BreedResponseDto> {
    const existing = await this.breedsRepository.findOne({
      where: { breed: newBreed.breed },
    });

    if (existing)
      throw new ConflictException(
        `Raza (${newBreed.breed}) ya se encuentra registrada y asociada a un animal`,
      );

    return await this.breedsRepository.save(newBreed);
  }

  async update(
    breedId: number,
    newBreed: UpdateBreedDto,
  ): Promise<BreedResponseDto> {
    const toUpdate = await this.findById(breedId);

    return await handleDatabaseError(
      () =>
        this.breedsRepository.save({
          ...toUpdate,
          ...newBreed,
        }),
      {
        conflictMessage: `Ya existe una raza con ese nombre (${newBreed.breed}) para el animal seleccionado.`,
      },
    );
  }

  async delete(breedId: number): Promise<void> {
    const res = await this.breedsRepository.delete({
      breeds_id: breedId,
    });

    throwIfNoEffect(res, 'Raza', breedId);
  }
}
