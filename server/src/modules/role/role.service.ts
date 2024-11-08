import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findAllNameRole(id: number): Promise<Array<string>> {
    const roles = await this.roleRepository.find();  
    let roleName: Array<string> = [];
    roles.forEach(group => {
      roleName.push(group.name);
    });
    return roleName
  }

  async findOne(id: number): Promise<any> {
    try {
      const role = await this.roleRepository.findOne({where: {id}});
      console.log("Find role by id:", role);
      if (!role) { 
        return {
          message: 'Not found',
          statusCode: 404,
          data: null,
        }
      }
      return {
        message: 'Found',
        statusCode: 200,
        data: role,
      };
    } catch (error) {
      return {
        message: 'Server is not OK',
        statusCode: 500,
        data: null,
      }
    }
  }

}
