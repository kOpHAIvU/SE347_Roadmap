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

  async findOne(id: number) {
    try {
      const role = await this.roleRepository.findOne({where: {id}});
      if (!role) { 
        throw new NotFoundException('Không tìm thấy nhóm người dùng');
      }
      return {
        message: 'Tìm thấy nhóm người dùng',
        statusCode: 200,
        data: role,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        // Nếu lỗi khác, ném ra lỗi InternalServerErrorException
        throw new InternalServerErrorException(
          'Có lỗi xảy ra trong quá trình tìm kiếm nhóm người dùng',
        );
      }
    }
  }
  

}
