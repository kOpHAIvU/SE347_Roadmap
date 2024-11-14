import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { Notification } from './entities/notification.entity';
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
    title: "Báo cáo ",
    content: "Không có gì",
    posterId: 1,
    isActive: true,
  }

  const updateNotificationDto = {
    content: "Không có gì",
  }

  describe('create new notification', () => {
    it('show create new notification successfully message', async() => {

    })

    it('show poster not found message', async() => {
      
    })

    it('show server error message', async() => {
      
    })
  })

  describe('find all notifications', () => {
    it('show find the list of available notifications successfully message', async() => {
      
    })

    it('show the notification not found message', async() => {
      
    })

    it('show the server error message', async() => {
      
    })
  });

  describe('find the notification by id', () => {
    it('show the notification successfully', async() => {
      
    })

    it('show the notification not found message', async() => {
      
    })

    it('show server error message', async() => {
      
    })
  })

  describe('update notification information', () => {
    it('show updating notification successfully message', async() => {
      
    })

    it('show poster not found message', async() => {
      
    })

    it('show the notification not found', async() => {
      
    })

    it('show server error message', async() => {
      
    })
  })

  describe('delete notification', () => {
    it('show deleting notification successfully message', async() => {
      
    })

    it('show the notification not found', async() => {
      
    })

    it('show server error message ', async() => {
      
    })
  })

});
