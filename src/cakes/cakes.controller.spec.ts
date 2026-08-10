import { Test, TestingModule } from '@nestjs/testing';
import { CakesController } from './cakes.controller';

describe('CakesController', () => {
  let controller: CakesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CakesController],
    }).compile();

    controller = module.get<CakesController>(CakesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
