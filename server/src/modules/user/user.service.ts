import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from '../auth/dto/login-dto';
import {ResponseDto} from './common/response.interface';
import { RoleService } from '../role/role.service';
import { Role } from '../role/entities/role.entity';
import { isNull } from 'util';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private roleService: RoleService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const roleResponse = await this.roleService.findOne(createUserDto.role);
    if (roleResponse.statusCode == 404 || roleResponse.statusCode == 500) {
      throw new UnauthorizedException('Role is not found');
    } 
    console.log("Role response:", roleResponse);
    let user: User = null;
    if (createUserDto.password) {
      const salt = await bcrypt.genSalt(); 
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
      user = await this.usersRepository.create({
        ...createUserDto,
        role: roleResponse.data,
        password: hashedPassword,  
      });
    } else {
      user = await this.usersRepository.create({
        ...createUserDto,
        role: roleResponse.data,
      });
    }
    
    const userSaved = await this.usersRepository.save(user);
    delete userSaved.password;
    return userSaved;
  }

  async findOne(loginDto: LoginDto): Promise<User> {

    const  user = await this.usersRepository.findOneBy({
      username: loginDto.username, 
    });
    if (!user) {
      throw new UnauthorizedException('Could not find user');
    } 
    return user;
  }

  async findOneById(id: number): Promise<ResponseDto> {
    try {
      const user = await this.usersRepository.findOne({where: {id}});
      if (!user) {
        return {
          statusCode: 404,
          message: 'User not found',
          data: null
        }
      } 
      return {
        statusCode: 200,
        message: 'Get user successfully',
        data: user
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: 'Server error when getting user'
      }
    }
  }

  async findByEmail(email: string): Promise<ResponseDto> {
    try {
      const user = await this.usersRepository.findOne({where: {email}});
      if (!user) {
        return {
          statusCode: 404,
          message: 'User not found',
          data: []
        }
      } 
      return {
        statusCode: 200,
        message: 'Get user successfully',
        data: user
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: 'Server error when getting user',
        data: []
      }
    }
  }

}
