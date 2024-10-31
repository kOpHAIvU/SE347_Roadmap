import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';
import { UserService } from '../user/user.service';
import { TimelineService } from '../timeline/timeline.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';

describe('MemberService', () => {
  let service: MemberService;

  const mockMemberServiceRepository = {
    createQueryBuilder: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
  }

  const mockUserService = {
    findOneById: jest.fn(),
  }

  const mockTimelineService = {
    findOneById: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        {
          provide: getRepositoryToken(Member),
          useValue: mockMemberServiceRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: TimelineService,
          useValue: mockTimelineService,
        }
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
