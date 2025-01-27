import { Test, TestingModule } from '@nestjs/testing';
import { TimelineController } from './timeline.controller';
import { TimelineService } from './timeline.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Timeline } from './entities/timeline.entity';
import { RoadmapService } from '../roadmap/roadmap.service';
import { UserService } from '../user/user.service';

describe('TimelineController', () => {
  let controller: TimelineController;
  let service: TimelineService; 

  const mockTimelineRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockRoadmapService = {
    findOneById: jest.fn(),
  }

  const mockUserService = {
    findOneById: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimelineController],
      providers: [
        TimelineService,
        {
          provide: getRepositoryToken(Timeline),
          useValue: mockTimelineRepository,
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

    controller = module.get<TimelineController>(TimelineController);
    service = module.get<TimelineService>(TimelineService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
