import { CreateServiceDetailDto } from './dto/create-service-detail.dto';
import { UpdateServiceDetailDto } from './dto/update-service-detail.dto';
import { ServiceDetail } from './entities/service-detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { TypesOfServiceService } from '../types-of-services/types-of-services.service';

@Injectable()
export class ServiceDetailsService {
  constructor(
    @InjectRepository(ServiceDetail)
    private serviceDetailRepository: Repository<ServiceDetail>,
    private typeOfService: TypesOfServiceService,
  ) {}

  async createWithManager(
    service_id: number,
    manager: EntityManager,
    details: CreateServiceDetailDto[],
  ) {
    const repo = manager.getRepository(ServiceDetail);
    const detailEntities = details.map((dto) =>
      repo.create({
        service: { services_id: service_id },
        type: { types_of_service_id: dto.type_of_service_id },
        employee: { person_id: dto.employee_id },
      }),
    );

    await repo.save(detailEntities);
  }

  findAll() {
    return `This action returns all serviceDetails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serviceDetail`;
  }

  update(id: number, updateServiceDetailDto: UpdateServiceDetailDto) {
    return `This action updates a #${id} serviceDetail`;
  }

  async deleteWithManager(id: number, manager: EntityManager) {
    await manager
      .getRepository(ServiceDetail)
      .softDelete({ service: { services_id: id } });
  }

  delete(id: number) {
    return `This action delete a #${id} serviceDetail`;
  }
}
