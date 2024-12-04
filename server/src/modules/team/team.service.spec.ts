import { Test, TestingModule } from '@nestjs/testing';
import { TeamService } from './team.service';
import { TimelineService } from '../timeline/timeline.service';
import { UserService } from '../user/user.service';
import { create } from 'domain';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';

describe('TeamService', () => {
  let service: TeamService;

  const mockTeamRepository = {
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
    getOne: jest.fn().mockResolvedValue({}),
  }

  const mockTimelineService = {
    findOneById: jest.fn(),
  }

  const mockUserService = {
    findOneById: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: getRepositoryToken(Team),
          useValue: mockTeamRepository
        },
        {
          provide: TimelineService,
          useValue: mockTimelineService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        }
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
