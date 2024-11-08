import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { mock } from 'node:test';
//src/modules/role/role.service.spec

describe('RoleService', () => {
  let service: RoleService;

  const mockRoleRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        }
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("find all role name", () => {
    it("should return name role when find all role name successfully", async() => {
      mockRoleRepository.find.mockResolvedValue([
        {
          id: 1,
          name: "admin",
        }
      ]);
      const role = await service.findAllNameRole(1);
      expect(role).toEqual(["admin"]);
    })
  })

  describe("find one role by id", () => {
    it("should return role when find role successfully", async () => {
      mockRoleRepository.findOne.mockResolvedValue({
        id: 1,
        name: "admin",
      });
      const role = await service.findOne(1);
      expect(role).toEqual({
        message: 'Found',
        statusCode: 200,
        data: {
          id: 1,
          name: "admin",
        }
      });
    })

    it("should return not found when not having role with id in database", async () => {
      mockRoleRepository.findOne.mockResolvedValue(null);
      expect(await service.findOne(1)).toEqual({
        message: 'Not found',
          statusCode: 404,
          data: null,
      });
    })

    it("should return server error when finding one role", async () => {
      mockRoleRepository.findOne.mockRejectedValue(new Error("Server is not OK"));
      expect(await service.findOne(1)).toEqual({
        message: 'Server is not OK',
        statusCode: 500,
        data: null,
      });
    })
  })

});
