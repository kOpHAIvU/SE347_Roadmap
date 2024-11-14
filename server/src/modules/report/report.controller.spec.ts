import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { UserService } from '../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockReportService = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

const mockUserService = {
  findOneById: jest.fn(),
}

describe('ReportController', () => {
  let controller: ReportController;
  let service: ReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        ReportService,
        {
          provide: getRepositoryToken(Report),
          useValue: mockReportService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        }
      ],
    }).compile();

    controller = module.get<ReportController>(ReportController);
    service = module.get<ReportService>(ReportService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create new report', () => {
    
  })
});
