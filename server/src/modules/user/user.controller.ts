import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from '../auth/dto/login-dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Get("id/:id")
  findOneById(@Param('id') id: string) {
    return this.userService.findOneById(+id);
  }

  @Get("hi")
  findOne(@Body() loginDto: LoginDto)
  {
    return this.userService.findOne(loginDto);
  }

}
