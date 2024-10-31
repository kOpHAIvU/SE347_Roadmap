import { Test, TestingModule } from '@nestjs/testing';
import { TimelineService } from './timeline.service';
import { find } from 'rxjs';
import { RoadmapService } from '../roadmap/roadmap.service';
import { UserService } from '../user/user.service';
import { create } from 'domain';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Timeline } from './entities/timeline.entity';

describe('TimelineService', () => {
  let service: TimelineService;

  const mockTimelineRepository = {
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
    getOne: jest.fn().mockResolvedValue({}),
  }

  const mockRoadmapService = {
    findOneById: jest.fn(),
  }

  const mockUserService = {
    findOneById: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimelineService,
        {
          provide: getRepositoryToken(Timeline),
          useValue: mockTimelineRepository
        },
        {
          provide: RoadmapService,
          useValue: mockRoadmapService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        }
      ],
    }).compile();

    service = module.get<TimelineService>(TimelineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
