import { mock } from 'node:test';
import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';
import { UserService } from '../user/user.service';
import { TimelineService } from '../timeline/timeline.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { get } from 'node:http';
import { permission } from 'node:process';
import { isAscii } from 'node:buffer';

// src/modules/member/member.service.spec

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

  const member = {
    id: 5,
    member: {
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
    },
    timeline: {
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
    },
    performance: 10,
    isActive: true,
    deletedAt: null,
    permission: 0
  }

  const mockUserData = {
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

  const mockTeamData = {
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
    }

  const createMember = {
    member: 1,
    performance: 10,
    timeline: 4,
    permission: 0,
    isActive: true,
  }

  const updateMember = {
    team: 5,
    permission: 1,
  }

  const updateMemberResult = {
    id: 5,
    memberId: {
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
    },
    team: {
      "id": 5,
      "title": "Timeline for studying group",
      "content": "Hi every body",
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
    },
    performance: 10,
    isActive: 1,
    deletedAt: null,
    permission: 0
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

  describe("check member exist in team", () => {
    it("should return false if member doesn't exist in team", async() => {
      const mockSelectMember = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }
      mockMemberServiceRepository.createQueryBuilder.mockReturnValue(mockSelectMember);
      const result = await service.checkMemberExistInTeam(1, 1);
      expect(result).toEqual({
        statusCode: 404,
        message: 'false',
      })
    })

    it("should return true if member exists in team", async() => {
      const mockSelectMember = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(member),
      }
      
      mockMemberServiceRepository.createQueryBuilder.mockReturnValue(mockSelectMember);
      const result = await service.checkMemberExistInTeam(1, 4);
      expect(result).toEqual({
        statusCode: 200,
        message: 'true',
      })
    })

    it("should return server error if having error when checking", async() => {
      const mockSelectMember = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockRejectedValue(new Error("Server is not OK")),
      }
      mockMemberServiceRepository.createQueryBuilder.mockReturnValue(mockSelectMember);
      const result = await service.checkMemberExistInTeam(1, 4);
      expect(result).toEqual({
        statusCode: 500,
        message: 'Failed to check member exist in team',
      })
    })
  })

  describe("add new user to timeline/team", () => {

    it("should return member exists in team", async() => {
      const response = {
        statusCode: 400,
        message: 'Member already exist in team',
      }
      const retrieveMemberFromDatabase = {
        statusCode: 200,
        message: 'true',
      }
      service.checkMemberExistInTeam = jest.fn().mockResolvedValue(retrieveMemberFromDatabase);
      const result = await service.create(createMember);
      expect(result).toEqual(response);
    })

    it("should return user not found", async() => {
      const response = {
        statusCode: 404,
        message: 'User not found',
      }
      const retrieveUserFromDatabase = {
        statusCode: 404,
        message: 'User not found',
        data: null
      }
      service.checkMemberExistInTeam = jest.fn().mockResolvedValue({
        statusCode: 404,
        message: 'false',
      });
      mockUserService.findOneById.mockResolvedValue(retrieveUserFromDatabase);
      mockTimelineService.findOneById.mockResolvedValue({
        statusCode: 200,
        message: 'Get timeline successfully',
        data: mockTeamData,
      })
      const result = await service.create(createMember);
      expect(result).toEqual(response);
    })

    it("should return team not found", async() => {
      const retrieveUserFromDatabase = {
        statusCode: 200,
        message: 'Get user successfully',
        data: mockUserData,
      }
      const retrieveTimelineFromDatabase = {
        statusCode: 404,
        message: 'Timeline not found'
      }
      const response = {
        statusCode: 404,
        message: 'Team not found',
      }
      service.checkMemberExistInTeam = jest.fn().mockResolvedValue({
        statusCode: 404,
        message: 'false',
      });
      mockUserService.findOneById.mockResolvedValue(retrieveUserFromDatabase);
      mockTimelineService.findOneById.mockResolvedValue(retrieveTimelineFromDatabase);
      const result = await service.create(createMember);
      expect(result).toEqual(response);
    })

    it("should return add member to team successfully", async() => {
      const response = {
        statusCode: 201,
        message: 'Create member successfully',
        data: member,
      }

      const retrieveUserFromDatabase = {
        statusCode: 200,
        message: 'Get user successfully',
        data: mockUserData,
      }

      const retrieveTimelineFromDatabase = {
        statusCode: 200,
        message: 'Get timeline successfully',
        data: mockTeamData,
      }

      service.checkMemberExistInTeam = jest.fn().mockResolvedValue({
        statusCode: 404,
        message: 'false',
      });
      mockUserService.findOneById.mockResolvedValue(retrieveUserFromDatabase);
      mockTimelineService.findOneById.mockResolvedValue(retrieveTimelineFromDatabase);
      const newDivision = {
        id: 5,
        deletedAt: null,
        ...createMember,
        member: mockUserData,
        timeline: mockTeamData,
      }
      console.log(newDivision)
      mockMemberServiceRepository.create.mockReturnValue(newDivision);
      mockMemberServiceRepository.save.mockResolvedValue(newDivision)
      const result = await service.create(createMember);
      expect(result).toEqual(response);
    })

    it("should server error", async() => {
      const response = {
        statusCode: 500,
        message: 'Failed to create member',
      }

      const retrieveUserFromDatabase = {
        statusCode: 200,
        message: 'Get user successfully',
        data: mockUserData,
      }

      const retrieveTimelineFromDatabase = {
        statusCode: 404,
        message: 'Timeline not found',
        data: mockTeamData,
      }

      service.checkMemberExistInTeam = jest.fn().mockResolvedValue({
        statusCode: 404,
        message: 'false',
      });
      mockUserService.findOneById.mockResolvedValue(retrieveUserFromDatabase);
      mockTimelineService.findOneById.mockResolvedValue(retrieveTimelineFromDatabase);
      mockMemberServiceRepository.create.mockReturnValue({
        ...createMember,
        member: mockUserData,
        team: mockTeamData,
      });
      mockMemberServiceRepository.save.mockRejectedValue(new Error("Server is not OK"));
      const result = await service.create(createMember);
      expect(result).toEqual(response);
    })

  })

  describe("find division by id", () => {
    it("should return member not found", async() => {
      const response = {
        statusCode: 404,
        message: 'Member not found',
        data: null
      }
      const mockSelectMember = {  
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }
      mockMemberServiceRepository.createQueryBuilder.mockReturnValue(mockSelectMember);
      const result = await service.findOneById(1);
      expect(result).toEqual(response);
    })

    it("should return failed to find member because of server error", async() => {
      const response = {
        statusCode: 500,
        message: 'Failed to find member',
      }
      const mockSelectMember = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockRejectedValue(new Error("Server is not OK")),
      }
      mockMemberServiceRepository.createQueryBuilder.mockReturnValue(mockSelectMember);
      const result = await service.findOneById(1);
      expect(result).toEqual(response);
    })

    it("should return find member successfully", async() => {
      const response = {
        statusCode: 200,
        message: 'Find member successfully',
        data: member,
      }
      const mockSelectMember = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(member),
      }
      mockMemberServiceRepository.createQueryBuilder.mockReturnValue(mockSelectMember);
      const result = await service.findOneById(5);
      expect(result).toEqual(response);
    })
  })

  describe("remove member from timeline ", () => {
    it("should return member not found", async() => {
      const response = {
        statusCode: 404,
        message: 'Member not found',
      }
      service.findOneById = jest.fn().mockResolvedValue({
        statusCode: 404,
        message: 'Member not found',
        data: null
      })
      const result = await service.remove(5);
      expect(result).toEqual(response);
    })

    it("should return server error", async() => {
      const response = {
        statusCode: 500,
        message: 'Failed to remove member',
      }
      service.findOneById = jest.fn().mockResolvedValue({
        statusCode: 200,
        message: 'Find member successfully',
        data: member,
      })
      const deleteDivision = member;
      deleteDivision.isActive = false;
      deleteDivision.deletedAt = new Date();
      mockMemberServiceRepository.save.mockRejectedValue(new Error("Server is not OK"));
      const result = await service.remove(5);
      expect(result).toEqual(response);
    })

    it("should return remove member successfully", async() => {
      service.findOneById = jest.fn().mockResolvedValue({
        statusCode: 200,
        message: 'Find member successfully',
        data: member,
      })
      const deleteDivision = member;
      deleteDivision.isActive = false;
      deleteDivision.deletedAt = new Date();
      mockMemberServiceRepository.save.mockResolvedValue(deleteDivision);
      const response = {
        statusCode: 200,
        message: 'Remove member successfully',
        data: deleteDivision,
      }
      const result = await service.remove(5);
      expect(result).toEqual(response);
    })
  })
});
