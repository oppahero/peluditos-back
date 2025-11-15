import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedPetsDto } from './dto/paginated-pets.dto';
import { PersonsService } from '../persons/persons.service';
import { BreedsService } from '../breeds/breeds.service';
import { PetResponseDto } from './dto/pet-response.dto';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Pet } from './entities/pet.entity';
import {
  throwIfNoEffect,
  throwIfNotFound,
} from 'src/helpers/throw-if-not-found.helper';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet) private petRepository: Repository<Pet>,
    private breedService: BreedsService,
    private personsService: PersonsService,
  ) {}

  private async findBy(
    key: string,
    value: any,
    withRelations = false,
    manager?: EntityManager,
  ): Promise<Pet | null> {
    const repo = manager ? manager.getRepository(Pet) : this.petRepository;

    return await repo.findOne({
      where: { [key]: value },
      relations: withRelations ? ['person', 'breed'] : [],
    });
  }

  async findAll({
    page = 1,
    limit = 10,
  }: PaginationDto): Promise<PaginatedPetsDto> {
    const [data, total] = await this.petRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { pets_id: 'ASC' },
      relations: ['person', 'breed'],
    });

    return {
      items: data,
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findEntityById(
    id: number,
    withRelations = false,
    manager?: EntityManager,
  ): Promise<Pet> {
    const pet = await this.findBy('pets_id', id, withRelations, manager);
    return throwIfNotFound(pet, 'Mascota', id);
  }

  async findById(id: number): Promise<PetResponseDto> {
    return await this.findEntityById(id, true);
  }

  async create(createPetDto: CreatePetDto) {
    const { breed_id, person_id, ...petData } = createPetDto;

    const breed = await this.breedService.findEntityById(breed_id);
    const person = await this.personsService.findEntityById(person_id);

    const pet = this.petRepository.create({
      ...petData,
      person,
      breed,
    });

    return await this.petRepository.save(pet);
  }

  async update(id: number, updatePetDto: UpdatePetDto) {
    const pet = await this.findEntityById(id);

    if (updatePetDto.breed_id) {
      const breed = await this.breedService.findEntityById(
        updatePetDto.breed_id,
      );
      pet.breed = breed;
    }

    if (updatePetDto.person_id) {
      const person = await this.personsService.findEntityById(
        updatePetDto.person_id,
      );
      pet.person = person;
    }

    const updatedPet = this.petRepository.merge(pet, updatePetDto);

    return await this.petRepository.save(updatedPet);
  }

  async delete(id: number) {
    const res = await this.petRepository.delete({
      pets_id: id,
    });

    throwIfNoEffect(res, 'Mascota', id);
  }
}
