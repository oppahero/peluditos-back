import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { AnimalResponseDto } from './dto/animal.dto';
import { Animals } from './animals.entity';
import { Repository } from 'typeorm';
import { CreateUpdateAnimalDto } from './dto/create-update-animal.dto';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectRepository(Animals) private animalsRepository: Repository<Animals>,
  ) {}

  async findAll(params: any): Promise<AnimalResponseDto[]> {
    return await this.animalsRepository.find();
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
