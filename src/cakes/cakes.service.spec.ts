import { Test, TestingModule } from '@nestjs/testing';
import { CakesService } from './cakes.service';

describe('CakesService', () => {
  let service: CakesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CakesService],
    }).compile();

    service = module.get<CakesService>(CakesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
