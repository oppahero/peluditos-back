import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { AnimalResponseDto } from './dto/animals-response.dto';
import { Animals } from './animals.entity';
import { Repository } from 'typeorm';
import { CreateUpdateAnimalDto } from './dto/create-update-animal.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedAnimalsDto } from './dto/paginated-animals.fto';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectRepository(Animals) private animalsRepository: Repository<Animals>,
  ) {}

  async findAll({
    page = 1,
    limit = 10,
  }: PaginationDto): Promise<PaginatedAnimalsDto> {
    const [data, total] = await this.animalsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { animals_id: 'ASC' }, // opcional
    });

    return {
      data,
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<AnimalResponseDto | null> {
    return await this.animalsRepository.findOne({
      where: { animals_id: id },
    });
  }

  create(newAnimal: CreateUpdateAnimalDto): Promise<AnimalResponseDto> {
    return this.animalsRepository.save(newAnimal);
  }

  async update(
    animalId: number,
    newAnimal: CreateUpdateAnimalDto,
  ): Promise<AnimalResponseDto> {
    const toUpdate = await this.findById(animalId);

    return this.animalsRepository.save({
      ...toUpdate,
      ...newAnimal,
    });
  }

  async delete(animalId: number): Promise<any> {
    return await this.animalsRepository.delete({ animals_id: animalId });
  }
}
