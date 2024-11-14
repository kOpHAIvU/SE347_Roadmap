import { create } from 'domain';
import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { UserService } from '../user/user.service';
import { IsNull } from 'typeorm';
//'src/modules/report/report.service.spec'

describe('ReportService', () => {
  let service: ReportService;

  const mockUserService = {
    findOneById: jest.fn(),
  }

  const mockReportRepository = {  
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
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
        ReportService,
        { 
          provide: getRepositoryToken(Report), 
          useValue: mockReportRepository
        },
        { 
          provide: UserService, 
          useValue: mockUserService 
        },
      ],

    }).compile();

    service = module.get<ReportService>(ReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const poster = {
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

  const report = {
    "id": 1,
    "title": "Báo cáo ",
    "content": "Không có gì",
    "createdAt": "2024-11-14T11:29:20.665Z",
    "deletedAt": null,
    "isActive": true,
    "reporter": {
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

  const createReportDto = {
    title: "Báo cáo ",
    content: "Không có gì",
    posterId: 1,
    isActive: true,
  }

  const updateReportDto = {
    content: "Không có gì",
  }

  describe('create new report', () => {
    it('Show the report when creating roadmap successfully', async() => {
      const getUserResponse = {
        statusCode: 200,
        message: 'Get user successfully',
        data: poster,
      }
      mockUserService.findOneById.mockResolvedValue(getUserResponse);
      mockReportRepository.create.mockReturnValue(report);
      mockReportRepository.save.mockResolvedValue(report);
      const result = await service.create(createReportDto);

      expect(mockUserService.findOneById).toHaveBeenCalledWith(createReportDto.posterId);
      expect(mockReportRepository.create).toHaveBeenCalledWith({
        ...createReportDto,
        reporter: poster,
      });
      expect(mockReportRepository.save).toHaveBeenCalledWith(report);

      expect(result).toEqual({
        statusCode: 201,
        message: 'Create report successfully',
        data: report,
      })
    })

    it('should show the server error message when creating report fails', async() => {
      const getUserResponse = {
        statusCode: 200,
        message: 'Get user successfully',
        data: poster,
      }
      mockUserService.findOneById.mockReturnValue(getUserResponse);
      mockReportRepository.create.mockReturnValue(report);
      mockReportRepository.save.mockRejectedValue(new Error('Failed to create report'));
      const result = await service.create(createReportDto);

      expect(mockUserService.findOneById).toHaveBeenCalledWith(createReportDto.posterId);
      expect(mockReportRepository.create).toHaveBeenCalledWith({
        ...createReportDto,
        reporter: poster,
      });
      expect(mockReportRepository.save).toHaveBeenCalledWith(report);

      expect(result).toEqual({
        statusCode: 500,
        message: 'Server is not OK',
        data: null,
      })
    })

    it ('should return error when poster not found', async() => {
      const getUserResponse = {
        statusCode: 404,
        message: 'Poster not found',
        data: null
      }
      mockUserService.findOneById.mockReturnValue(getUserResponse);
      const result = await service.create(createReportDto);

      expect(mockUserService.findOneById).toHaveBeenCalledWith(createReportDto.posterId);
      expect(result).toEqual({
        statusCode: 404,
        message: 'Poster not found',
        data: null,
      })
    })

  })

  describe('show the list of report by time', () => {
    it('should return all reports', async() => {
      const reportResponse = {
        statusCode: 200,
        message: 'Get all reports successfully',
        data: [report]
      };
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([report]),
      };
      mockReportRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      const result = await service.findAll(1,10);
      expect(result).toEqual(reportResponse);
    })

    it('should return error when not found any report', async() => {
      const reportResponse = {
        statusCode: 404,
        message: 'Report not found',
        data: null
      };
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };
      mockReportRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      const result = await service.findAll(1,10);
      // expect(mockReportRepository.createQueryBuilder).toHaveBeenCalledWith({
      //   id: 1,
      //   isActive: true,
      //   deletedAt: IsNull(),
      // });
      expect(result).toEqual(reportResponse);
    })

    it('should return error when server error', async() => {
      const reportResponse = {
        statusCode: 500,
        message: 'Server is not OK',
        data: null
      };
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockRejectedValue(new Error('Failed to get reports')),
      };
      mockReportRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      const result = await service.findAll(1,10);
      expect(result).toEqual(reportResponse);
    })
  })

  describe('find the report by id', () => {
    it('should return the report when finding report successfully', async() => {
      const reportResponse = {
        statusCode: 200,
        message: 'Get report successfully',
        data: report,
      }
      mockReportRepository.findOneBy.mockResolvedValue(report);
      const result = await service.findOne(1);
      expect(mockReportRepository.findOneBy).toHaveBeenCalledWith({
        id: 1,
        isActive: true,
        deletedAt: IsNull(),
      });
      expect(result).toEqual(reportResponse);
    })

    it('should return error when report not found', async() => {
      const reportResponse = {
        statusCode: 404,
        message: 'Report not found',
        data: null,
      }
      mockReportRepository.findOneBy.mockResolvedValue(null);
      const result = await service.findOne(1);
      expect(mockReportRepository.findOneBy).toHaveBeenCalledWith({
        id: 1,
        isActive: true,
        deletedAt: IsNull(),
      });
      expect(result).toEqual(reportResponse);
    })

    it('should return error when server error', async() => {
      const reportResponse = {
        statusCode: 500,
        message: 'Server is not OK',
        data: null,
      }
      mockReportRepository.findOneBy.mockRejectedValue(new Error('Failed to get report'));
      const result = await service.findOne(1);
      expect(mockReportRepository.findOneBy).toHaveBeenCalledWith({
        id: 1,
        isActive: true,
        deletedAt: IsNull(),
      });
      expect(result).toEqual(reportResponse);
    })
  })

  describe('update report', () => {
    it('should return the report when updating report successfully', async() => {
      const reportResponse = {
        statusCode: 200,
        message: 'Update report successfully',
        data: report,
      }
      service.findOne = jest.fn().mockResolvedValue(reportResponse);
      mockUserService.findOneById.mockResolvedValue({
        statusCode: 200,
        message: 'Get user successfully',
        data: poster,
      });
      mockReportRepository.save.mockResolvedValue(report);
      const result = await service.update(1, updateReportDto);
      expect(mockReportRepository.findOneBy).toHaveBeenCalledWith({
        id: 1,
        isActive: true,
        deletedAt: IsNull(),
      });
      expect(mockReportRepository.save).toHaveBeenCalledWith({
        ...report,
        ...updateReportDto,
      });
      expect(result).toEqual(reportResponse);
    })

    it('should return error when report not found', async() => {
      const reportResponse = {
        statusCode: 404,
        message: 'Report not found',
        data: null,
      }
      service.findOne = jest.fn().mockResolvedValue(reportResponse);
      const result = await service.update(1, updateReportDto); 
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(reportResponse);
    })

    it('should return error when user not found', async() => {
      const reportResponse = {
        statusCode: 404,
        message: 'Poster not found',
        data: null,
      }
      service.findOne = jest.fn().mockResolvedValue({
        statusCode: 200,
        message: 'Get report successfully',
        data: report,
      });
      mockUserService.findOneById.mockResolvedValue(reportResponse);
      const result = await service.update(1, updateReportDto);
      expect(result).toEqual(reportResponse);
    })

    it('should return error when server error', async() => {
      const reportResponse = {
        statusCode: 500,
        message: 'Server is not OK',
        data: null,
      }
      service.findOne = jest.fn().mockRejectedValue(new Error('Failed to get report'));
      const result = await service.update(1, updateReportDto);
      expect(result).toEqual(reportResponse);
    })
  })

  describe('delete report', () => {
    it('should return the report when deleting report successfully', async() => {
      const reportResponse = {
        statusCode: 200,
        message: 'Delete report successfully',
        data: report,
      }
      const getReportResponse = {
        statusCode: 200,
        message: 'Get report successfully',
        data: report,
      }
      service.findOne = jest.fn().mockResolvedValue(getReportResponse);
      let reportTemp = report;
      reportTemp.isActive = false;
      let deletedTime = new Date();
      reportTemp.deletedAt = deletedTime ;
      mockReportRepository.save.mockResolvedValue(reportTemp);
      const result = await service.remove(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(mockReportRepository.save).toHaveBeenCalledWith({
        ...report,
        isActive: false,
        deletedAt: deletedTime ,
      });
      expect(result).toEqual(reportResponse);
    })

    it('should return error when report not found', async() => {
      const reportResponse = {
        statusCode: 404,
        message: 'Report not found',
        data: null,
      }
      service.findOne = jest.fn().mockResolvedValue(reportResponse);
      const result = await service.remove(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(reportResponse);
    })

    it('should return error when server error', async() => {
      const reportResponse = {
        statusCode: 500,
        message: 'Server is not OK',
        data: null,
      }
      service.findOne = jest.fn().mockRejectedValue(new Error('Failed to get report'));
      const result = await service.remove(1);
      expect(result).toEqual(reportResponse);
    })
  })

});
