import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { Notification } from './entities/notification.entity';
import { IsNull } from 'typeorm';
import exp from 'constants';
import { mock } from 'node:test';
// 'src/modules/notification/notification.service.spec'

describe('NotificationService', () => {
  let service: NotificationService;

  const mockUserService = {
    findOneById: jest.fn(),
  }

  const mockNotificationRepository = {
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
        NotificationService,
        { 
          provide: getRepositoryToken(Notification), 
          useValue: mockNotificationRepository
        },
        { 
          provide: UserService, 
          useValue: mockUserService 
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const notification = {
    "id": 2,
    "title": "New Roadmap Has Been Uploaded!",
    "content": "Welcome to the latest updates! We just released a new Roadmap to help you easily track and plan for the future of the system. \nThe title of roadmap is: Roadmap for security\nPlease check it out and let us know if you have any feedback or questions. \n",
    "createdAt": "2024-11-14T10:58:20.865Z",
    "deletedAt": null,
    "isActive": true,
    "postNotification": {
        "id": 1,
        "username": "loantuyetcute123",
        "password": "$2a$10$42WQ117KnbllmKxnR31xou2ebJiGJ8Ov6v0tfeDTggh5AToVKMjhG",
        "fullName": "Nguyen Thi Tuyet Loan",
        "gender": "Nu",
        "avatar": "https://lh3.googleusercontent.com/a/ACg8ocKdODLlenePnZHFTWMfGJaidHoKjRiXpipJgQPSsBVb8TsS6IgN=s96-c",
        "email": "nguyenloan@gmail.com",
        "isActive": false,
        "createdAt": "2024-09-22T08:08:08.446Z",
        "deletedAt": null
    }
  }

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

  const createNotificationDto = {
    title: "New Roadmap Has Been Uploaded!",
    content: "Welcome to the latest updates! We just released a new Roadmap to help you easily track and plan for the future of the system. \nThe title of roadmap is: Roadmap for security\nPlease check it out and let us know if you have any feedback or questions. \n",
    posterId: 1,
    isActive: true,
  }

  const updateNotificationDto = {
    content: "Welcome to the latest updates! We just released a new Roadmap to help you easily track and plan for the future of the system. \nThe title of roadmap is: Roadmap for security\nPlease check it out and let us know if you have any feedback or questions. \n",
  }

  describe('create new notification', () => {
    it('show create new notification successfully message', async() => {
      const getOwnerResponse = {
        statusCode: 200,
        message: 'Get user successfully',
        data: poster
      }
      mockUserService.findOneById.mockResolvedValue(getOwnerResponse);
      mockNotificationRepository.create.mockReturnValue(notification);
      mockNotificationRepository.save.mockResolvedValue(notification);
      const result = await service.create(createNotificationDto);
      
      expect(mockUserService.findOneById).toHaveBeenCalledWith(createNotificationDto.posterId);
      expect(mockNotificationRepository.create).toHaveBeenCalledWith({
        ...createNotificationDto,
        postNotification: poster,
      });
      
      expect(result).toEqual({
        statusCode: 201,
        message: 'Create notification successfully',
        data: notification
      })
    })

    it('show poster not found message', async() => {
      const getPosterResponse = {
        statusCode: 404,
        message: 'Poster not found',
        data: null
      }
      mockUserService.findOneById.mockResolvedValue({
        statusCode: 404,
        message: 'User not found',
        data: null
      });
      const result = await service.create(createNotificationDto);
      expect(result).toEqual(getPosterResponse);
    })

    it('show server error message', async() => {
      const getOwnerResponse = {
        statusCode: 200,
        message: 'Get user successfully',
        data: poster
      }
      mockUserService.findOneById.mockResolvedValue(getOwnerResponse);
      mockNotificationRepository.create.mockReturnValue(notification);
      mockNotificationRepository.save.mockRejectedValue(new Error());
      const result = await service.create(createNotificationDto);
      expect(result).toEqual({
        statusCode: 500,
        message: "Server is not OK",
        data: null
      })
    })
  })

  describe('find all notifications', () => {
    it('show find the list of available notifications successfully message', async() => {
      const response = {
        statusCode: 200,
        message: 'Get all notifications successfully',
        data: [notification]
      }
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([notification]),
      };
      mockNotificationRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      const result = await service.findAll();
      expect(result).toEqual(response);
    })

    it('show the notification not found message', async() => {
      const response = {
        statusCode: 404,
        message: 'Notification not found',
        data: null
      };
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(null),
      };
      mockNotificationRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      const result = await service.findAll();
      expect(result).toEqual(response);
    })

    it('show the server error message', async() => {
      const response = {
        statusCode: 500,
        message: 'Failed to get notifications',
        data: null
      }
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockRejectedValue(new Error('Failed to get notifications')),
      };
      mockNotificationRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      const result = await service.findAll(1,10);
      expect(result).toEqual(response);
    })
  });

  describe('find the notification by id', () => {
    it('show the notification successfully', async() => {
      const response = {
        statusCode: 200,
        message: 'Get notification successfully',
        data: notification
      }
      mockNotificationRepository.findOneBy.mockReturnValue(notification);
      const result = {
        statusCode: 200,
        message: 'Get notification successfully',
        data: notification,
      }
      expect(result).toEqual(response);
    })

    it('show the notification not found message', async() => {
      const response = {
        statusCode: 404,
        message: 'Notification not found',
        data: null
      };
      mockNotificationRepository.findOneBy.mockResolvedValue(null);
      const result = await service.findOne(1);
      expect(mockNotificationRepository.findOneBy).toHaveBeenCalledWith({
        id: 1,
        isActive: true,
        deletedAt: IsNull(),
      })
      expect(result).toEqual(response);
    })

    it('show server error message', async() => {
      const response = {
        statusCode: 500,
        message: 'Server error when getting notification',
        data: null
      };
      mockNotificationRepository.findOneBy.mockRejectedValue(new Error("Server error when getting notification"));
      expect(mockNotificationRepository.findOneBy).toHaveBeenCalledWith({
        id: 1,
        isActive: true,
        deletedAt: IsNull(),
      })
      const result = await service.findOne(1);
      expect(result).toEqual(response);
    })
  })

});
