import { Test, TestingModule } from '@nestjs/testing';
import { TimelineService } from './timeline.service';
import { find } from 'rxjs';
import { RoadmapService } from '../roadmap/roadmap.service';
import { UserService } from '../user/user.service';
import { create } from 'domain';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Timeline } from './entities/timeline.entity';
import { CreateTeamDto } from '../team/dto/create-team.dto';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { CreateRoadmapDto } from '../roadmap/dto/create-roadmap.dto';
import { time } from 'console';

//  src/modules/timeline/timeline.service.spec.ts

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

  const user = {
    "id": 1,
    "username": "loantuyetcute123",
    "password": "$2a$10$42WQ117KnbllmKxnR31xou2ebJiGJ8Ov6v0tfeDTggh5AToVKMjhG",
    "fullName": "Nguyen Thi Tuyet Loan",
    "gender": "Nu",
    "avatar": "https://lh3.googleusercontent.com/a/ACg8ocKdODLlenePnZHFTWMfGJaidHoKjRiXpipJgQPSsBVb8TsS6IgN=s96-c",
    "email": "nguyenloan@gmail.com",
    "isActive": false,
    "createdAt": "2024-09-22T08:08:08.446Z",
    "deletedAt": null,
    "role": {
        "id": 1,
        "name": "admin"
    }
  }
  const roadmap = {
    "id": 3,
    "code": "1222222",
    "title": "Roadmap",
    "avatar": "",
    "content": "Description for first roadmap",
    "clone": 0,
    "react": 0,
    "isActive": true,
    "createdAt": "2024-10-05T06:40:53.964Z",
    "deletedAt": null,
    "owner": {
        "id": 1,
        "username": "loantuyetcute123",
        "password": "$2a$10$42WQ117KnbllmKxnR31xou2ebJiGJ8Ov6v0tfeDTggh5AToVKMjhG",
        "fullName": "Nguyen Thi Tuyet Loan",
        "gender": "Nu",
        "avatar": "https://lh3.googleusercontent.com/a/ACg8ocKdODLlenePnZHFTWMfGJaidHoKjRiXpipJgQPSsBVb8TsS6IgN=s96-c",
        "email": "nguyenloan@gmail.com",
        "isActive": false,
        "createdAt": "2024-09-22T08:08:08.446Z",
        "deletedAt": null,
        "role": {
            "id": 1,
            "name": "admin"
        }
    }
  }

  const timeline = {
    "id": 4,
    "title": "Timeline for group",
    "content": "Hi ",
    "isActive": true,
    "createdAt": "2024-10-07T03:32:34.335Z",
    "deletedAt": null,
    "roadmap": {
        "id": 1,
        "code": "12333333",
        "title": "First roadmap",
        "avatar": "",
        "content": "Road map for backend",
        "clone": 0,
        "react": 0,
        "isActive": true,
        "createdAt": "2024-10-04T10:20:07.312Z",
        "deletedAt": null
    }
  };

  describe("create new timeline", () => {
    const createTimelineDto: CreateTimelineDto = {
      title: "Team 1",
      content: "Team 1 description",
      leader: 1,
      roadmap: 1,
      isActive: false
    }
    const createRoadmapDto: CreateRoadmapDto = {
      code: "123",
      title: "Roadmap for backend",
      avatar: "1",
      content: "Roadmap for backend description",
      owner: 1,
      clone: 12,
      react: 12,
      isActive: true,
    }
    const createUserDto = {
      username: 'loantuyetcute123', 
      password: 'loantuyetcute',
      fullName: "Nguyen Thi Tuyet Loan",
      gender: "Nu",
      email: "nguyenloancute@gmail.com",
      role: 1,
      avatar: "https://lh3.googleusercontent.com/a/ACg8ocKdODLlenePnZHFTWMfGJaidHoKjRiXpipJgQPSsBVb8TsS6IgN=s96-c",
    }

    it("should throw error if leader not found", async () => {
      const response = {
        statusCode: 404,
        message: 'User not found',
        data: null,
      }
      mockUserService.findOneById.mockResolvedValue(response);
      mockRoadmapService.findOneById.mockResolvedValue(createRoadmapDto); 
      
      await expect(service.create(createTimelineDto))
      .resolves.toEqual({
        statusCode: 404,
        message: 'User not found',
        data: null
      })
    });

    it("should throw error if roadmap not found", async() => {
      const response = {
        statusCode: 404,
        message: 'Roadmap not found',
        data: null,
      }
      mockUserService.findOneById.mockResolvedValue({
        statusCode: 200,
        message: 'Get user successfully',
        data: createUserDto, // Is any non-null object
      });
      mockRoadmapService.findOneById.mockResolvedValue(response); 
      await expect(service.create(createTimelineDto))
      .resolves.toEqual({
        statusCode: 404,
        message: 'Roadmap not found',
        data: null
      })
    })

    it("should create a timeline successfully", async () => {
      mockUserService.findOneById.mockResolvedValue({
        statusCode: 200,
        message: 'Get user successfully',
        data: user,
      });
      mockRoadmapService.findOneById.mockResolvedValue({
        statusCode: 200,
        message: 'Get roadmap successfully',
        data: {
          roadmap
        }
      }); 
      const timeline = {
        ...createTimelineDto,
        user,
        roadmap,
      }
      mockTimelineRepository.create.mockReturnValue(timeline);
      mockTimelineRepository.save.mockResolvedValue(timeline);
      expect(await service.create(createTimelineDto)).toEqual({
        statusCode: 201,
        message: 'Create timeline successfully',
        data: timeline,
      })
    })

    it("return error when server is not OK", async () => {
      mockUserService.findOneById.mockResolvedValue(null);
      mockRoadmapService.findOneById.mockResolvedValue(null); 
      const timeline = {
        ...createTimelineDto,
        roadmap: null,
        leader: null,
      }
      mockTimelineRepository.create.mockReturnValue(timeline);
      mockTimelineRepository.save.mockRejectedValue(new Error('Server error'));
      expect(await service.create(createTimelineDto)).toEqual({
        statusCode: 500,
        message: 'Server error when creating timeline',
      })
    })

  })

  describe("find all timeline", () => {
    
    it("should return list of timelines successfully", async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{
          timeline
        }]), 
      };
      mockTimelineRepository.createQueryBuilder
                            .mockReturnValue(mockQueryBuilder);
      expect(await service.findAll(1, 10)).toEqual({
        statusCode: 200,
        message: 'Get list of timelines successfully',
        data: [{
          timeline,
        }]
      }) 
    })

    it("should return error when server is not OK", async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockRejectedValue(new Error('Server error')),
      };
      mockTimelineRepository.createQueryBuilder
                            .mockReturnValue(mockQueryBuilder);
      expect(await service.findAll(1, 10)).toEqual({
        statusCode: 500,
        message: 'Server error when finding all timelines',
      })
    })

    it("should return not found when timelines not found", async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };
      mockTimelineRepository.createQueryBuilder
                            .mockReturnValue(mockQueryBuilder);
      expect(await service.findAll(1, 10)).toEqual({
        statusCode: 404,
        message: 'Timelines not found',
        data: null
      })
    })

  })

  describe("find one timeline by id", () => {
    it("should return timeline successfully", async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(timeline),
      }
      mockTimelineRepository.createQueryBuilder
                            .mockReturnValue(mockQueryBuilder);
      expect(await service.findOneById(1)).toEqual({
        statusCode: 200,
        message: 'Get timeline successfully',
        data: timeline,
      })
    })

    it("should return not found when timelines not found", async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }
      mockTimelineRepository.createQueryBuilder
                            .mockReturnValue(mockQueryBuilder);
       expect(await service.findOneById(1)).toEqual({
        statusCode: 404,
        message: 'Timeline not found'
      })
    })

    it("should return 500 if an error occurs", async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockRejectedValue(new Error("Database error")),
      };
  
      mockTimelineRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
  
      const result = await service.findOneById(1);
      expect(result).toEqual({
        statusCode: 500,
        message: 'Server error when finding timeline',
      });
    });

  })

  describe("update timeline", () => {
    const updateTimelineDto = {
      title: "Timeline for group",
      content: "Hi ",
      roadmap: 1,
      isActive: true
    }

    it("should return timeline not found when updating timeline", async() =>{
      const response = {
        statusCode: 404,
        message: 'Timeline not found'
      };
      service.findOneById = jest.fn().mockResolvedValue(response);
      expect(await service.update(1, updateTimelineDto)).toEqual(response);
    })

    it("should return roadmap not found when updating timeline", async() => {
      const timelineResponse = {
        statusCode: 200,
        message: 'Get timeline successfully',
        data: timeline
      }
      service.findOneById = jest.fn().mockResolvedValue(timelineResponse);
      const roadmapResponse = {
        statusCode: 404,
        message: 'Roadmap not found',
        data: null
      }
      mockRoadmapService.findOneById.mockResolvedValue(roadmapResponse);
      const leaderResponse = {
        statusCode: 200,
        message: 'Get user successfully',
        data: user,
      }
      mockUserService.findOneById.mockResolvedValue(leaderResponse);
      const timelineCreateValue = {
        ...timeline,
        roadmap: null,
        leader: leaderResponse.data
      }
      const timelineCreateResponse = {
        statusCode: 404,
        message: 'Roadmap not found'
      }
      mockTimelineRepository.create.mockReturnValue(timelineCreateValue)
      mockTimelineRepository.save.mockResolvedValue(timelineCreateValue);
      expect(await service.update(1, updateTimelineDto)).toEqual(timelineCreateResponse);
    })

    it("should return leader not found when updating timeline", async()=> {
      const timelineResponse = {
        statusCode: 200,
        message: 'Get timeline successfully',
        data: timeline
      }
      service.findOneById = jest.fn().mockResolvedValue(timelineResponse);
      const roadmapResponse = {
        statusCode: 404,
        message: 'Roadmap not found',
        data: roadmap
      }
      mockRoadmapService.findOneById.mockResolvedValue(roadmapResponse);
      const leaderResponse = {
        statusCode: 200,
        message: 'Get user successfully',
        data: null,
      }
      mockUserService.findOneById.mockResolvedValue(leaderResponse);
      const timelineCreateValue = {
        ...timeline,
        roadmap: roadmap,
        leader: null
      }
      const timelineCreateResponse = {
        statusCode: 404,
        message: 'User not found'
      }
      mockTimelineRepository.create.mockReturnValue(timelineCreateValue)
      mockTimelineRepository.save.mockResolvedValue(timelineCreateValue);
      expect(await service.update(1, updateTimelineDto)).toEqual(timelineCreateResponse);
    })

    it("should return update timeline successfully when updating timeline", async() => {
      const timelineResponse = {
        statusCode: 200,
        message: 'Get timeline successfully',
        data: timeline
      }
      service.findOneById = jest.fn().mockResolvedValue(timelineResponse);
      const roadmapResponse = {
        statusCode: 404,
        message: 'Roadmap not found',
        data: roadmap
      }
      mockRoadmapService.findOneById.mockResolvedValue(roadmapResponse);
      const leaderResponse = {
        statusCode: 200,
        message: 'Get user successfully',
        data: user,
      }
      mockUserService.findOneById.mockResolvedValue(leaderResponse);
      const timelineCreateValue = {
        ...timeline,
        roadmap: roadmap,
        leader: user
      }
      const timelineCreateResponse = {
        statusCode: 200,
        message: 'Update timeline successfully',
        data: timelineCreateValue
      }
      mockTimelineRepository.create.mockReturnValue(timelineCreateValue)
      mockTimelineRepository.save.mockResolvedValue(timelineCreateValue);
      expect(await service.update(1, updateTimelineDto)).toEqual(timelineCreateResponse);
    })

    it("should return server error when updating timeline information", async() => {
      const timelineResponse = {
        statusCode: 200,
        message: 'Get timeline successfully',
        data: timeline
      }
      service.findOneById = jest.fn().mockResolvedValue(timelineResponse);
      const roadmapResponse = {
        statusCode: 404,
        message: 'Roadmap not found',
        data: roadmap
      }
      mockRoadmapService.findOneById.mockResolvedValue(roadmapResponse);
      const leaderResponse = {
        statusCode: 200,
        message: 'Get user successfully',
        data: user,
      }
      mockUserService.findOneById.mockResolvedValue(leaderResponse);
      const timelineCreateValue = {
        ...timeline,
        roadmap: roadmap,
        leader: user
      }
      const timelineCreateResponse = {
        statusCode: 500,
        message: 'Server error when updating timeline',
      }
      mockTimelineRepository.create.mockReturnValue(timelineCreateValue)
      mockTimelineRepository.save.mockRejectedValue(new Error('Server error'));
      expect(await service.update(1, updateTimelineDto)).toEqual(timelineCreateResponse);
    })
  })

  describe("remove timeline", () => {
    it("should return timeline not found when removing timeline", async() =>{
      const response = {
        statusCode: 404,
        message: 'Timeline not found'
      };
      service.findOneById = jest.fn().mockResolvedValue(response);
      expect(await service.remove(1)).toEqual(response);
    })

    it("should return timeline when removing timeline successfully", async () => {
      const timelineResponse = {
        statusCode: 200,
        message: 'Get timeline successfully',
        data: timeline
      }
      
      service.findOneById = jest.fn().mockResolvedValue(timelineResponse);
      const removedTimeline = {
        ...timeline,
        isActive: false,
        deletedAt: new Date()
      }
      mockTimelineRepository.save.mockResolvedValue(removedTimeline);
      expect(await service.remove(1)).toEqual({
        statusCode: 204,
        message: 'Remove timeline successfully',
        data: removedTimeline
      })
    })

    it("should return server error when deleting timeline", async() => {
      const timelineResponse = {
        statusCode: 200,
        message: 'Get timeline successfully',
        data: timeline
      }
      service.findOneById = jest.fn().mockResolvedValue(timelineResponse);
      mockTimelineRepository.save.mockRejectedValue(new Error('Server error'));
      expect(await service.remove(1)).toEqual({
        statusCode: 500,
        message: 'Server error when removing timeline'
      })
    })
  })

});
