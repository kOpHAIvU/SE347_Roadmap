import { Test, TestingModule } from '@nestjs/testing';
import { RoadmapService } from './roadmap.service';
import { UserService } from '../user/user.service';
import { create } from 'domain';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Roadmap } from './entities/roadmap.entity';

describe('RoadmapService', () => {
  let service: RoadmapService;

  const mockUserService = {
    findOneById: jest.fn(),
  }

  const mockRoadmapRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoadmapService,
        {
          provide: getRepositoryToken(Roadmap),
          useValue: mockRoadmapRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        }
      ],
    }).compile();

    service = module.get<RoadmapService>(RoadmapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe ('Create roadmap', () => {
    it('Show "User not found" message if cant find role by id', async() => {
    })
  })

});
