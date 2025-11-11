import { ServiceResponseDto } from './dto/service-response.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { UsersService } from '../users/users.service';
import { Service } from './entities/service.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PetsService } from '../pets/pets.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

@ApiTags('Services')
@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    private petService: PetsService,
    private usersService: UsersService,
  ) {}

  findAll() {
    return `This action returns all services`;
  }

  findOne(id: number) {
    return `This action returns a #${id} service`;
  }

  async create(newService: CreateServiceDto): Promise<ServiceResponseDto> {
    const { pet_id, user_id, ...serviceData } = newService;

    const pet = await this.petService.findEntityById(pet_id);
    const user = await this.usersService.findEntityById(user_id);

    const res = this.serviceRepository.create({
      ...serviceData,
      observation: serviceData.observation ?? null,
      pet,
      user,
    });

    const service = await this.serviceRepository.save(res);

    return plainToInstance(ServiceResponseDto, service);
  }

  update(id: number, updateServiceDto: UpdateServiceDto) {
    return `This action updates a #${id} service`;
  }

  remove(id: number) {
    return `This action removes a #${id} service`;
  }
}
