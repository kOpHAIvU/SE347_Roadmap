import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post('signup')
  signup(
    @Body() 
    userDto: CreateUserDto
  ): Promise<User> {
    return this.userService.create(userDto);
  }

  @Post('login')
  login(
    @Body()
    loginDTO: LoginDto,
  ) {
    return this.authService.login(loginDTO);
  }
  
}