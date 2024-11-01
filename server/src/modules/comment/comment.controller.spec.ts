import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from '../comment/entities/comment.entity';
import { UserService } from '../user/user.service';
import { RoadmapService } from '../roadmap/roadmap.service';

describe('CommentController', () => {
  let controller: CommentController;
  let service: CommentService;

  const mockCommentRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserService = {
    findOneById: jest.fn(),
  }

  const mockRoadmapService = {
    findOneById: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(Comment),
          useValue: mockCommentRepository, // Sử dụng mock repository
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

    controller = module.get<CommentController>(CommentController);
    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
