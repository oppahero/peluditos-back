import { Test, TestingModule } from '@nestjs/testing';
import { TypesOfServicesController } from './types-of-service.controller';
import { TypesOfServiceService } from './types-of-services.service';

describe('TypesOfServiceController', () => {
  let controller: TypesOfServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypesOfServicesController],
      providers: [TypesOfServiceService],
    }).compile();

    controller = module.get<TypesOfServicesController>(
      TypesOfServicesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
