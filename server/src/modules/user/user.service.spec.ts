import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { RoleService } from '../role/role.service';
import { create } from 'domain';
import { get } from 'http';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;

  const mockUserService = {
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
          useValue: mockUserService,
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
});
