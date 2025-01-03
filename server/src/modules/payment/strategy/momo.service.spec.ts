import { Test, TestingModule } from '@nestjs/testing';
import { MomoService } from './momo.service';

describe('MomoService', () => {
  let service: MomoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MomoService],
    }).compile();

    service = module.get<MomoService>(MomoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
