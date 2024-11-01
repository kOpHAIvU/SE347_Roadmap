import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { find } from 'rxjs';
import { RoadmapService } from '../roadmap/roadmap.service';
import { UserService } from '../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from '../comment/entities/comment.entity';

describe('CommentService', () => {
  let service: CommentService;

  const mockCommentRepository = {
    findOneById: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
  }

  const mockUserService = {
    findOneById: jest.fn(),
  }

  const mockRoadmapService = {
    findOneById: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: RoadmapService,
          useValue: mockRoadmapService,
        }
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
