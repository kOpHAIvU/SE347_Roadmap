import { Test, TestingModule } from '@nestjs/testing';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { TimelineService } from '../timeline/timeline.service';
import { Member } from './entities/member.entity';

describe('MemberController', () => {
  let controller: MemberController;
  let service: MemberService;

  const mockMemberRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserService = {
    findOneById: jest.fn(),
  }

  const mockTimelineService = {
    findOneById: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [
        MemberService,
        {
          provide: getRepositoryToken(Member),
          useValue: mockMemberRepository, 
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

    controller = module.get<MemberController>(MemberController);
    service = module.get<MemberService>(MemberService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
