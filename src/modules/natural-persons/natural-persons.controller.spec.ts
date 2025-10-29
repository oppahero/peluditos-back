import { Test, TestingModule } from '@nestjs/testing';
import { NaturalPersonsController } from './natural-persons.controller';
import { NaturalPersonsService } from './natural-persons.service';

describe('NaturalPersonsController', () => {
  let controller: NaturalPersonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NaturalPersonsController],
      providers: [NaturalPersonsService],
    }).compile();

    controller = module.get<NaturalPersonsController>(NaturalPersonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
