import { Test, TestingModule } from '@nestjs/testing';
import { RoadmapService } from './roadmap.service';
import { UserService } from '../user/user.service';
import { create } from 'domain';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Roadmap } from './entities/roadmap.entity';
import { IsNull } from 'typeorm';
//"src/modules/roadmap/roadmap.service.spec"

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

  const createRoadmapDto = {
    id: 3,
    code: "1222222",
    title: "Roadmap",
    avatar: "",
    content: "Description for first roadmap",
    clone: 0,
    react: 0,
    isActive: true,
    createdAt: "2024-10-05T06:40:53.964Z",
    deletedAt: null,
    owner: 1,
  }

  const createUserDto = {
    username: 'loantuyetcute123', 
    password: 'loantuyetcute',
    fullName: "Nguyen Thi Tuyet Loan",
    gender: "Nu",
    email: "nguyenloancute@gmail.com",
    role: 3,
    avatar: "",
  }

  const updateRoadmapDto = {
    "code": "1222222",
    "title": "Roadmap",
    "avatar": "",
    "content": "Description for first roadmap",
    "clone": 0,
    "react": 0,
  }

  const updateRoadmap = {
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

  describe ('Create roadmap', () => {
    const returnUserResponse = {
      statusCode: 200,
      message: 'Get user successfully',
      data: user,
    }
    it('Show the roadmap when creating roadmap successfully', async() => {
      mockUserService.findOneById.mockResolvedValue(returnUserResponse);
      mockRoadmapRepository.create.mockReturnValue(roadmap);
      mockRoadmapRepository.save.mockResolvedValue(roadmap);
      const result = await service.create(createRoadmapDto);

      expect(mockUserService.findOneById).toHaveBeenCalledWith(createRoadmapDto.owner);
      expect(mockRoadmapRepository.create)
        .toHaveBeenCalledWith(expect.objectContaining({
          ...createRoadmapDto,
          owner: user,
        }));
      expect(mockRoadmapRepository.save).toHaveBeenCalledWith(roadmap);

      expect(result).toEqual({
        statusCode: 201,
        message: 'Create roadmap successfully',
        data: roadmap,
      });
    })

    it('should show the error message when creating roadmap fails', async () => {  
      mockUserService.findOneById.mockResolvedValue(returnUserResponse);
      mockRoadmapRepository.create.mockReturnValue(roadmap); 
      mockRoadmapRepository.save.mockRejectedValue(new Error("Server error"));

      expect(mockUserService.findOneById).toHaveBeenCalledWith(createRoadmapDto.owner);
      expect(mockRoadmapRepository.create)
        .toHaveBeenCalledWith(expect.objectContaining({
          ...createRoadmapDto,
          owner: user,
        }));
      expect(mockRoadmapRepository.save).toHaveBeenCalledWith(roadmap);

      expect(await service.create(createRoadmapDto)).toEqual({
          statusCode: 500,
          message: 'Failed to create roadmap',
      });
    });
  })

  describe("find all roadmap", () => {
    it("should show roadmap not found when finding all roadmap", async() => {
      const response = {
        statusCode: 404,
        message: 'Roadmap not found',
      };
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(null),
      };
      mockRoadmapRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);    
      const result = await service.findAll(1, 10);
      expect(result).toEqual(response);
    })

    it("should show list of roadmap when finding all roadmap successfully", async() => {
      const response = {
        statusCode: 200,
        message: 'Get this of roadmap successfully',
        data: [roadmap],
      }
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([roadmap]),
      };
      mockRoadmapRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      const result = await service.findAll(1, 10);
      expect(result).toEqual(response);
    })

    it("should return server error when find all roadmap", async() => {
      const response = {
        statusCode: 500,
        message: 'Failed to get all road maps'
      }
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockRejectedValue(new Error("Server error")),
      };
      mockRoadmapRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      const result = await service.findAll(1, 10);
      expect(result).toEqual(response);
    })
  }) 

  describe("find roadmap by code", () => {
    it("should return not found when can't find roadmap by code", async() => {
      const response = {
        statusCode: 404,
        message: 'Roadmap not found',
        data: null
      }
      mockRoadmapRepository.findOneBy.mockResolvedValue(null);
      const result = await service.findOneByCode("11");
      expect(mockRoadmapRepository.findOneBy).toHaveBeenCalledWith({
        code: "11",
        isActive: true,
        deletedAt: IsNull(),
      })
      expect(result).toEqual(response);
    })

    it("should return roadmap when finding roadmap by code successfully", async() => {
      const response = {
        statusCode: 200,
        message: 'Get roadmap successfully',
        data: roadmap,
      }
      mockRoadmapRepository.findOneBy.mockResolvedValue(roadmap);
      const result = await service.findOneByCode("1222222");
      expect(mockRoadmapRepository.findOneBy).toHaveBeenCalledWith({
        code: "1222222",
        isActive: true,
        deletedAt: IsNull(),
      })
      expect(result).toEqual(response);
    })
    it("should return server error when finding roadmap", async() => {
      const response = {
        statusCode: 500,
        message: 'Failed to get roadmap'
      }
      mockRoadmapRepository.findOneBy.mockRejectedValue(new Error("Server error"));
      const result = await service.findOneByCode("1222222");
      expect(mockRoadmapRepository.findOneBy).toHaveBeenCalledWith({
        code: "1222222",
        isActive: true,
        deletedAt: IsNull(),
      })
      expect(result).toEqual(response);
    })
  })

  describe("find roadmap by id", () => {
    it("should return not found when can't find roadmap by id", async() => {
      const response = {
        statusCode: 404,
        message: 'Roadmap not found',
        data: null
      }
      mockRoadmapRepository.findOneBy.mockResolvedValue(null);
      const result = await service.findOneById(3);
      expect(mockRoadmapRepository.findOneBy).toHaveBeenCalledWith({
        id: 3,
        isActive: true,
        deletedAt: IsNull(),
      })
      expect(result).toEqual(response);
    })

    it("should return roadmap when finding roadmap by id successfully", async() => {
      const response = {
        statusCode: 200,
        message: 'Get roadmap successfully',
        data: roadmap,
      }
      mockRoadmapRepository.findOneBy.mockResolvedValue(roadmap);
      const result = await service.findOneByCode("1222222");
      expect(mockRoadmapRepository.findOneBy).toHaveBeenCalledWith({
        code: "1222222",
        isActive: true,
        deletedAt: IsNull(),
      })
      expect(result).toEqual(response);
    })
    it("should return server error when finding roadmap", async() => {
      const response = {
        statusCode: 500,
        message: 'Failed to get roadmap'
      }
      mockRoadmapRepository.findOneBy.mockRejectedValue(new Error("Server error"));
      const result = await service.findOneByCode("1222222");
      expect(mockRoadmapRepository.findOneBy).toHaveBeenCalledWith({
        code: "1222222",
        isActive: true,
        deletedAt: IsNull(),
      })
      expect(result).toEqual(response);
    })
  })

  describe("update roadmap by id", () => {
    it("should return roadmap not found when updating road by id", async() => {
      const response = {
        statusCode: 404,
        message: 'Roadmap not found',
        
      }
      const retrieveRoadmapFromDatabase = {
        statusCode: 404,
        message: 'Roadmap not found',
        data: null
      }
        const retrieveUserFromDatabase = {
          statusCode: 200,
          message: 'Get user successfully',
          data: user
        }
    
      service.findOneById = jest.fn().mockResolvedValue(retrieveRoadmapFromDatabase);
      mockUserService.findOneById.mockResolvedValue(retrieveUserFromDatabase);
      expect(await service.updateById(3, updateRoadmapDto)).toEqual(response);
    })

    it("should return leader not found when updating roadmap by id", async() => {
      const retrieveUserFromDatabase = {
        statusCode: 404,
        message: 'User not found',
        data: null
      }
      const retrieveRoadmapFromDatabase = {
        statusCode: 200,
        message: 'Get roadmap successfully',
        data: roadmap,
      }
      const response = {
        statusCode: 404,
        message: 'User not found',
      }
      service.findOneById = jest.fn().mockResolvedValue(retrieveRoadmapFromDatabase);
      mockUserService.findOneById.mockResolvedValue(retrieveUserFromDatabase);
      const result = await service.updateById(3, updateRoadmapDto);
      expect(service.findOneById).toHaveBeenCalledWith(3);
      expect(mockUserService.findOneById).toHaveBeenCalledWith(1);
      expect(result).toEqual(response);
    })

    it("should return server error when updating roadmap by id", async() => {
      const retrieveUserFromDatabase = {
        statusCode: 404,
        message: 'User not found',
        data: user
      }
      const retrieveRoadmapFromDatabase = {
        statusCode: 200,
        message: 'Get roadmap successfully',
        data: roadmap,
      }
      const response = {
        statusCode: 500,
        message: 'Failed to update roadmap'
      }

      service.findOneById = jest.fn().mockResolvedValue(retrieveRoadmapFromDatabase);
      mockUserService.findOneById.mockResolvedValue(retrieveUserFromDatabase);
      mockRoadmapRepository.save.mockRejectedValue(new Error("Server error"));
      const result = await service.updateById(3, updateRoadmapDto);
      expect(service.findOneById).toHaveBeenCalledWith(3);
      expect(mockUserService.findOneById).toHaveBeenCalledWith(1);
      expect(result).toEqual(response);
    })

    it("should return roadmap when updating roadmap information by id successfully", async () => {
      const retrieveUserFromDatabase = {
        statusCode: 200,
        message: 'Get user successfully',
        data: user,
      };
      const retrieveRoadmapFromDatabase = {
        statusCode: 200,
        message: 'Get roadmap successfully',
        data: roadmap,
      };
      const response = {
        statusCode: 201,
        message: 'Update roadmap successfully',
        data: roadmap,
      };
    
      service.findOneById = jest.fn().mockResolvedValue(retrieveRoadmapFromDatabase);
      mockUserService.findOneById.mockResolvedValue(retrieveUserFromDatabase);
      mockRoadmapRepository.create.mockReturnValue({
        ...roadmap,
        ...updateRoadmapDto,
        owner: user,
      });
      mockRoadmapRepository.save.mockResolvedValue({
        ...roadmap,
        ...updateRoadmapDto,
        owner: user,
      });
    
      const result = await service.updateById(3, updateRoadmapDto);
    
      // Kiểm tra các lời gọi hàm
      expect(service.findOneById).toHaveBeenCalledWith(3);
      expect(mockUserService.findOneById).toHaveBeenCalledWith(1);
    
      // Kiểm tra các lời gọi hàm create và save với object đầy đủ
      expect(mockRoadmapRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        ...updateRoadmapDto,
        owner: user,
      }));
      expect(mockRoadmapRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        ...roadmap,
        ...updateRoadmapDto,
        owner: user,
      }));
    
      expect(result).toEqual(response);
    });
    
  })

  describe("update roadmap by code", () => {
    it("should return roadmap not found when updating road by code", async() => {
      const retrieveRoadmapFromDatabase = {
        statusCode: 404,
        message: 'Roadmap not found',
        data: null
      }

      const response = {
        statusCode: 404,
        message: 'Roadmap not found',
      }

      const retrieveUserFromDatabase = {
        statusCode: 200,
        message: 'Get user successfully',
        data: user
      }

      service.findOneByCode = jest.fn().mockResolvedValue(retrieveRoadmapFromDatabase);
      mockUserService.findOneById.mockResolvedValue(retrieveUserFromDatabase);
      const result = await service.updateByCode("1222", updateRoadmapDto);
      // expect(service.findOneByCode).toHaveBeenCalledWith("1222222");
      // expect(mockUserService.findOneById).toHaveBeenCalledWith(1);
      expect(result).toEqual(response);
    })

    it("should return leader not found when updating roadmap by code", async() => {
      const retrieveUserFromDatabase = {
        statusCode: 404,
        message: 'User not found',
        data: null
      }
      const retrieveRoadmapFromDatabase = {
        statusCode: 200,
        message: 'Get roadmap successfully',
        data: roadmap,
      }
      const response = {
        statusCode: 404,
        message: 'User not found',
      }
      service.findOneByCode = jest.fn().mockResolvedValue(retrieveRoadmapFromDatabase);
      mockUserService.findOneById.mockResolvedValue(retrieveUserFromDatabase);
      const result = await service.updateByCode("1222222", updateRoadmapDto);
      expect(service.findOneByCode).toHaveBeenCalledWith("1222222");
      expect(mockUserService.findOneById).toHaveBeenCalledWith(1);
      expect(result).toEqual(response);
    })

    it("should return server error when updating roadmap by code", async() => {
      const retrieveUserFromDatabase = {
        statusCode: 200,
        message: 'Get user successfully',
        data: user
      }
      const retrieveRoadmapFromDatabase = {
        statusCode: 200,
        message: 'Get roadmap successfully',
        data: roadmap,
      }
      const response = {
        statusCode: 500,
        message: 'Failed to update roadmap'
      }

      service.findOneByCode = jest.fn().mockResolvedValue(retrieveRoadmapFromDatabase);
      mockUserService.findOneById.mockResolvedValue(retrieveUserFromDatabase);
      mockRoadmapRepository.save.mockRejectedValue(new Error("Server error"));
      const result = await service.updateByCode("1222222", updateRoadmapDto);
      expect(service.findOneByCode).toHaveBeenCalledWith("1222222");
      expect(mockUserService.findOneById).toHaveBeenCalledWith(1);
      expect(result).toEqual(response);
    })

    it("should return roadmap when updating roadmap information by code successfully", async() => {
      const retrieveUserFromDatabase = {
        statusCode: 200,
        message: 'Get user successfully',
        data: user,
      };
      const retrieveRoadmapFromDatabase = {
        statusCode: 200,
        message: 'Get roadmap successfully',
        data: roadmap,
      };
      const response = {
        statusCode: 201,
        message: 'Update roadmap successfully',
        data: roadmap,
      };
    
      service.findOneByCode = jest.fn().mockResolvedValue(retrieveRoadmapFromDatabase);
      mockUserService.findOneById.mockResolvedValue(retrieveUserFromDatabase);
      mockRoadmapRepository.create.mockReturnValue({
        ...roadmap,
        ...updateRoadmapDto,
        owner: user,
      });
      mockRoadmapRepository.save.mockResolvedValue({
        ...roadmap,
        ...updateRoadmapDto,
        owner: user,
      });
    
      const result = await service.updateByCode("1222222", updateRoadmapDto);
      expect(service.findOneByCode).toHaveBeenCalledWith("1222222");
      expect(mockUserService.findOneById).toHaveBeenCalledWith(1);
      expect(mockRoadmapRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        ...updateRoadmapDto,
        owner: user,
      }));
      expect(mockRoadmapRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        ...roadmap,
        ...updateRoadmapDto,
        owner: user,
      }));
      expect(result).toEqual(response);
    })
  })

  describe("remove roadmap from database by code", () => {
    it("should return roadmap not found when remove roadmap from database", async() => {
      const response = {
        statusCode: 404,
        message: 'Roadmap not found'
      } 
      const retrieveRoadmapFromDatabase = {
        statusCode: 404,
        message: 'Roadmap not found',
        data: null
      }
      service.findOneByCode = jest.fn().mockResolvedValue(retrieveRoadmapFromDatabase);
      expect(await service.removeByCode("1222222")).toEqual(response);
    })
    it("should return server error when removing roadmap from database", async() => {
      const response = {
        statusCode: 500,
        message: 'Failed to delete roadmap'
      } 
      const retrieveRoadmapFromDatabase = {
        statusCode: 404,
        message: 'Roadmap not found',
        data: roadmap
      }
      service.findOneByCode = jest.fn().mockResolvedValue(retrieveRoadmapFromDatabase);
      mockRoadmapRepository.save.mockRejectedValue(new Error("Server error"));
      expect(await service.removeByCode("1222222")).toEqual(response);
    })
    it("should return removing roadmap successfully when removing roadmap from database", async() => {

      const retrieveRoadmapFromDatabase = {
        statusCode: 404,
        message: 'Roadmap not found',
        data: roadmap
      }
      const deleteRoadmap = roadmap;
      deleteRoadmap.deletedAt = new Date();
      deleteRoadmap.isActive = false;
      const response = {
        statusCode: 200,
        message: 'Delete roadmap successfully',
        data: deleteRoadmap,
      } 
      service.findOneByCode = jest.fn().mockResolvedValue(retrieveRoadmapFromDatabase);
      mockRoadmapRepository.save.mockResolvedValue(deleteRoadmap);
      const result = await service.removeByCode("1222222");
      expect(service.findOneByCode).toHaveBeenCalledWith("1222222");
      expect(mockRoadmapRepository.save).toHaveBeenCalledWith(deleteRoadmap);
      expect(result).toEqual(response);
    })
  })

});
