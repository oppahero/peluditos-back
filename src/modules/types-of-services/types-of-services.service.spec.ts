import { Test, TestingModule } from '@nestjs/testing';
import { TypesOfServiceService } from './types-of-services.service';

describe('TypesOfServicesService', () => {
  let service: TypesOfServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypesOfServiceService],
    }).compile();

    service = module.get<TypesOfServiceService>(TypesOfServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
