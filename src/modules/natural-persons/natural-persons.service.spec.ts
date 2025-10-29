import { Test, TestingModule } from '@nestjs/testing';
import { NaturalPersonsService } from './natural-persons.service';

describe('NaturalPersonsService', () => {
  let service: NaturalPersonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NaturalPersonsService],
    }).compile();

    service = module.get<NaturalPersonsService>(NaturalPersonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
