import { PaginatedTypesOfServicesDto } from './dto/paginated-types-of-services.dto';
import { TypeOfServiceResponseDto } from './dto/type-of-service-response.dto';
import { UpdateTypeOfServiceDto } from './dto/update-type-of-service.dto';
import { CreateTypeOfServiceDto } from './dto/create-type-of-service.dto';
import { throwIfNotFound } from 'src/helpers/throw-if-not-found.helper';
import { handleDatabaseError } from 'src/helpers/database-error-helper';
import { TypesOfService } from './entities/types-of-service.entity';
import { ConflictException, Injectable } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TypesOfServiceService {
  constructor(
    @InjectRepository(TypesOfService)
    private typesOfServiceRepository: Repository<TypesOfService>,
  ) {}

  private async findByDescription(
    description: string,
  ): Promise<TypeOfServiceResponseDto | null> {
    return await this.typesOfServiceRepository.findOne({
      where: { description },
    });
  }

  async findAll({
    page = 1,
    limit = 10,
  }: PaginationDto): Promise<PaginatedTypesOfServicesDto> {
    const [data, total] = await this.typesOfServiceRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { types_of_services_id: 'ASC' },
    });

    return {
      items: data,
      total,
      page,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findById(id: number): Promise<TypeOfServiceResponseDto> {
    const typeOfService = await this.typesOfServiceRepository.findOne({
      where: { types_of_services_id: id },
    });

    return throwIfNotFound(typeOfService, 'Tipo de Servicio', id);
  }

  async create(newType: CreateTypeOfServiceDto) {
    const existing = await this.findByDescription(newType.description);

    if (existing)
      throw new ConflictException(
        `Servicio (${newType.description}) ya se encuentra registrado`,
      );

    return await this.typesOfServiceRepository.save(newType);
  }

  async update(
    typeId: number,
    newType: UpdateTypeOfServiceDto,
  ): Promise<TypeOfServiceResponseDto> {
    const toUpdate = await this.findById(typeId);

    return await handleDatabaseError(
      () =>
        this.typesOfServiceRepository.save({
          ...toUpdate,
          ...newType,
        }),
      {
        conflictMessage: `Ya existe una servicio con esa descripción (${newType.description}) .`,
      },
    );
  }

  async delete(typeId: number): Promise<void> {
    const res = await this.typesOfServiceRepository.delete({
      types_of_services_id: typeId,
    });

    throwIfNotFound(res, 'Tipo de Servicio', typeId);
  }
}
