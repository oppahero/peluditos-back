import { TypeOfServiceResponseDto } from '../types-of-services/dto/type-of-service-response.dto';
import { TypesOfService } from '../types-of-services/entities/type-of-service.entity';
import { ServiceDetailsService } from '../service-details/service-details.service';
import { DataSource, EntityManager, In, IsNull, Repository } from 'typeorm';
import { throwIfNotFound } from 'src/helpers/throw-if-not-found.helper';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { PaginatedServicesDto } from './dto/paginated-services.dto';
import { ServiceResponseDto } from './dto/service-response.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { UsersService } from '../users/users.service';
import { Service } from './entities/service.entity';
import { plainToInstance } from 'class-transformer';
import { PetsService } from '../pets/pets.service';
import { Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Services')
@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private petService: PetsService,
    private usersService: UsersService,
    private detailsService: ServiceDetailsService,
  ) {}

  private async findBy(
    key: string,
    value: any,
    withRelations = false,
    manager?: EntityManager,
  ): Promise<Service | null> {
    const repo = manager
      ? manager.getRepository(Service)
      : this.serviceRepository;

    return await repo.findOne({
      where: { [key]: value, deleted_at: IsNull() },
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
      where: { deleted_at: IsNull() },
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

  async findEntityById(
    id: number,
    withRelations = false,
    manager?: EntityManager,
  ): Promise<Service> {
    const service = await this.findBy(
      'services_id',
      id,
      withRelations,
      manager,
    );
    return throwIfNotFound(service, 'Servicio', id);
  }

  async findById(id: number): Promise<ServiceResponseDto> {
    const service = await this.findEntityById(id, true);
    return plainToInstance(ServiceResponseDto, service, {
      excludeExtraneousValues: true,
    });
  }

  getTotalAmount(details: TypeOfServiceResponseDto[]) {
    return details.reduce((acc, item) => acc + Number(item.price), 0);
  }

  async create(newService: CreateServiceDto) {
    const { pet_id, user_id, details, ...serviceData } = newService;

    return await this.dataSource.transaction(async (manager) => {
      // Se recuperan las entidades
      const pet = await this.petService.findEntityById(pet_id, false, manager);
      const user = await this.usersService.findEntityById(user_id, manager);

      // Se recuperan los tipos de servicios
      const ids = details.map((d) => d.type_of_service_id);

      const serviceTypes = await manager.find(TypesOfService, {
        where: { types_of_service_id: In(ids) },
      });

      // Se calcula monto total
      const total_amount = this.getTotalAmount(serviceTypes);

      const res = manager.create(Service, {
        ...serviceData,
        observation: serviceData.observation ?? null,
        pet,
        user,
        total_amount,
      });

      const service = await manager.save(res);

      // Se registran detalles
      await this.detailsService.createWithManager(
        service.services_id,
        manager,
        details,
      );
    });
  }

  update(id: number, updateServiceDto: UpdateServiceDto) {
    return `This action updates a #${id} service`;
  }

  async delete(id: number) {
    await this.dataSource.transaction(async (manager) => {
      await this.detailsService.deleteWithManager(id, manager);

      await manager.getRepository(Service).softDelete({ services_id: id });
    });
  }
}
