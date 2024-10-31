import { Test, TestingModule } from '@nestjs/testing';
import { PerformanceController } from './performance.controller';
import { PerformanceService } from './performance.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PerformanceController', () => {
  let controller: PerformanceController;
  let service: PerformanceService;

  const mockPerformanceRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerformanceController],
      providers: [
        PerformanceService,
        {
          provide: getRepositoryToken(Performance),
          useValue: mockPerformanceRepository,
        }
      ],
    }).compile();

    controller = module.get<PerformanceController>(PerformanceController);
    service = module.get<PerformanceService>(PerformanceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
