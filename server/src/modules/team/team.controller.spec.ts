import { Test, TestingModule } from '@nestjs/testing';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';

describe('TeamController', () => {
  let controller: TeamController;
  let service: TeamService;

  const mockMemberRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [
        TeamService,
        {
          provide: getRepositoryToken(Team),
          useValue: mockMemberRepository,
        }
      ],
    }).compile();

    controller = module.get<TeamController>(TeamController);
    service = module.get<TeamService>(TeamService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
