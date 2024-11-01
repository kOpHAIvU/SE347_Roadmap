import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { RoleService } from '../role/role.service';
import { create } from 'domain';
import { get } from 'http';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
// src/modules/user/user.service.spec'

describe('UserService', () => {
  let service: UserService;

  const mockUsersRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
  }

  const mockRoleService = {
    findOne: jest.fn(),
  }

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
        {
          provide: RoleService,
          useValue: mockRoleService,
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create new user', () => {
    it("Show throw UnauthorizedException error contains 'Couldn't find role'", async () => {
      mockRoleService.findOne.mockResolvedValue({ statusCode: 404 });
      await expect(service.create({
        username: 'loantuyetcute123', 
        password: 'loantuyetcute',
        fullName: "Nguyen Thi Tuyet Loan",
        gender: "Nu",
        email: "nguyenloancute@gmail.com",
        role: 3,
        avatar: "https://lh3.googleusercontent.com/a/ACg8ocKdODLlenePnZHFTWMfGJaidHoKjRiXpipJgQPSsBVb8TsS6IgN=s96-c",
      }))
        .rejects
        .toThrow(UnauthorizedException);
    })

    // it("Return null if the system doesn't contain this account", async () => {
    //   mockRoleService.findOne.mockResolvedValue({data: null});
    //   await expect (service.create({
    //     username: 'loantuyetcute123', 
    //     password: 'loantuyetcute',
    //     fullName: "Nguyen Thi Tuyet Loan",
    //     gender: "Nu",
    //     email: "nguyenloancute@gmail.com",
    //     role: 4,
    //     avatar: "https://lh3.googleusercontent.com/a/ACg8ocKdODLlenePnZHFTWMfGJaidHoKjRiXpipJgQPSsBVb8TsS6IgN=s96-c",
    //   }))
    // })

    it('should hash the password and save the user if role exists', async () => {
      mockRoleService.findOne.mockResolvedValue({
        statusCode: 200,
        data: {
          id: 1,
          name: 'admin'
        }
      })
      const hashedPassword = await bcrypt.hash('12345', 10);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      
      const userDto = {
        username: 'loantuyetcute123', 
        password: 'loantuyetcute',
        fullName: "Nguyen Thi Tuyet Loan",
        gender: "Nu",
        email: "nguyenloancute@gmail.com",
        role: 1,
        avatar: "https://lh3.googleusercontent.com/a/ACg8ocKdODLlenePnZHFTWMfGJaidHoKjRiXpipJgQPSsBVb8TsS6IgN=s96-c",
      };
      const mockUser = { ...userDto, password: hashedPassword, role: { id: 1, name: 'admin' } };
      //mockUsersRepository.create.mockReturnValue(mockUser);
      mockUsersRepository.create.mockResolvedValue(mockUser);
      mockUsersRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(userDto);

      expect(result.password).toBeUndefined(); // Password should be deleted after saving
      expect(mockUsersRepository.create).toHaveBeenCalledWith(expect.objectContaining({ username: 'loantuyetcute123' }));
      expect(mockUsersRepository.save).toHaveBeenCalled();
    })
  })

  describe('Find one account by login account',  () => {
    const user = {
      username: 'loantuyetcute123', 
      password: 'loantuyet',
      fullName: "Nguyen Thi Tuyet Loan",
      gender: "Nu",
      email: "nguyenloancute@gmail.com",
      role: {
        "id": 1,
        "name": "admin"
      },
      avatar: "https://lh3.googleusercontent.com/a/ACg8ocKdODLlenePnZHFTWMfGJaidHoKjRiXpipJgQPSsBVb8TsS6IgN=s96-c",
      isActive: false,
      createdAt: "2024-09-22T08:08:08.446Z",
      deletedAt: null,
    }

    it('should return UnauthorizedException error if user exists', async () => {
      const data = {
        username: 'loantuyetcute123', 
        password: 'loantuyet',
      }
      mockUsersRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(data)).rejects.toThrow(UnauthorizedException);
    })

    it("should return user if user exists", async () => {
      const data = {
        username: "loantuyetcute123",
        password: "loantuyet",
      }
      const user = {
        username: 'loantuyetcute123', 
        password: 'loantuyet',
        fullName: "Nguyen Thi Tuyet Loan",
        gender: "Nu",
        email: "nguyenloancute@gmail.com",
        role: {
          "id": 1,
          "name": "admin"
        },
        avatar: "https://lh3.googleusercontent.com/a/ACg8ocKdODLlenePnZHFTWMfGJaidHoKjRiXpipJgQPSsBVb8TsS6IgN=s96-c",
        isActive: false,
        createdAt: "2024-09-22T08:08:08.446Z",
        deletedAt: null,
      }
      mockUsersRepository.findOneBy.mockResolvedValue(user);
      const result = await service.findOne(data);
      await expect(result).toEqual(user);
    })
  })

  describe('Find one account by id', () => {
    const user = {
      username: 'loantuyetcute123', 
      password: 'loantuyet',
      fullName: "Nguyen Thi Tuyet Loan",
      gender: "Nu",
      email: "nguyenloancute@gmail.com",
      role: {
        "id": 1,
        "name": "admin"
      },
      avatar: "https://lh3.googleusercontent.com/a/ACg8ocKdODLlenePnZHFTWMfGJaidHoKjRiXpipJgQPSsBVb8TsS6IgN=s96-c",
      isActive: false,
      createdAt: "2024-09-22T08:08:08.446Z",
      deletedAt: null,
    }

    it("return user not found", async () => {
      const response = {
        statusCode: 404,
        message: 'User not found',
        data: []
      }
      mockUsersRepository.findOne.mockResolvedValue(null);
      const result = await service.findOneById(2);
      expect(result).toEqual(response);
    })

    it("return response when find user by id", async () => {
      const response = {
        statusCode: 200,
        message: 'Get user successfully',
        data: user
      }
      mockUsersRepository.findOne.mockResolvedValue(user);
      await expect(await service.findOneById(2)).toEqual(response);
    })

    it("Server is not OK when find user by id", async () => {
      const response = {
        statusCode: 500,
        message: 'Server error when getting user'
      }
      const error = new Error("Server is not OK");
      mockUsersRepository.findOne.mockRejectedValue(error);
      expect(await service.findOneById(1)).toEqual(response);
    })

  })

  describe('Find the user by email', () => {
    it("return user is not found when finding user by email", async () => {
      const response = {
        statusCode: 404,
        message: 'User not found',
        data: []
      }
      mockUsersRepository.findOne.mockResolvedValue(null);
      expect(await service.findByEmail('nguyenloan@gmail.com')).toEqual(response);
    })

    it("return user when finding user by email", async () => {
      const user = {
        username: 'loantuyetcute123', 
        password: 'loantuyet',
        fullName: "Nguyen Thi Tuyet Loan",
        gender: "Nu",
        email: "nguyenloancute@gmail.com",
        role: {
          "id": 1,
          "name": "admin"
        },
        avatar: "https://lh3.googleusercontent.com/a/ACg8ocKdODLlenePnZHFTWMfGJaidHoKjRiXpipJgQPSsBVb8TsS6IgN=s96-c",
        isActive: false,
        createdAt: "2024-09-22T08:08:08.446Z",
        deletedAt: null,
      }

      const response = {
        statusCode: 200,
        message: 'Get user successfully',
        data: user
      }

      mockUsersRepository.findOne.mockResolvedValue(user);
      expect(await service.findByEmail("nguyenloan@gmail.com")).toEqual(response);
    })

    it("return server error when finding user by email", async () => {
      const response = {
        statusCode: 500,
        message: 'Server error when getting user',
        data: []
      }
      const error = new Error("Server error");
      mockUsersRepository.findOne.mockRejectedValue(error);
      expect(await service.findByEmail("nguyenloan@gmail.com")).toEqual(response);
    })
  })
})

