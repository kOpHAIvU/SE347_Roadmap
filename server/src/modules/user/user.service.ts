import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from '../auth/dto/login-dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt(); 
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    const user = await this.usersRepository.save(createUserDto);
    delete user.password;
    return user;
  }

  async findOne(loginDto: LoginDto): Promise<User> {

    const  user = await this.usersRepository.findOneBy({email: loginDto.email});
    if (!user) {
      throw new UnauthorizedException('Could not find user');
    } 
    return user;
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({where: {id}});
    if (!user) {
      throw new UnauthorizedException('Could not find user');
    } 
    return user;
  }

}
