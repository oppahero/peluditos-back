import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { AnimalDto } from './dto/animal.dto';
import { Animals } from './animals.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AnimalsService {
  constructor(
    @InjectRepository(Animals) private animalsRepository: Repository<Animals>,
  ) {}

  async findAll(params: any): Promise<Animals[]> {
    return await this.animalsRepository.find();
  }

  async findById(id: number): Promise<Animals | null> {
    return await this.animalsRepository.findOne({
      where: { animals_id: id },
    });
  }

  create(newAnimal: AnimalDto): Promise<Animals> {
    return this.animalsRepository.save(newAnimal);
  }

  async update(animalId: number, newAnimal: AnimalDto): Promise<Animals> {
    const toUpdate = await this.findById(animalId);
    const updated = {
      ...toUpdate,
      ...newAnimal,
    };

    return this.animalsRepository.save(updated);
  }

  async delete(animalId: number): Promise<any> {
    return await this.animalsRepository.delete({ animals_id: animalId });
  }
}
