import { PaginatedServicesDto } from './dto/paginated-services.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ServiceResponseDto } from './dto/service-response.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { UsersService } from '../users/users.service';
import { Service } from './entities/service.entity';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { PetsService } from '../pets/pets.service';
import { Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Repository } from 'typeorm';

@ApiTags('Services')
@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    private petService: PetsService,
    private usersService: UsersService,
  ) {}

  private async findBy(
    key: string,
    value: any,
    withRelations = false,
  ): Promise<Service | null> {
    return await this.serviceRepository.findOne({
      where: { [key]: value },
      relations: withRelations ? ['pet', 'user'] : [],
    });
  }

  async findAll({
    page = 1,
    limit = 10,
  }: PaginationDto): Promise<PaginatedServicesDto> {
    const [data, total] = await this.serviceRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { services_id: 'ASC' },
      // relations: ['pet', 'user'],
    });

    const items = plainToInstance(ServiceResponseDto, data, {
      excludeExtraneousValues: true,
    });

    return {
      items,
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
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
}
