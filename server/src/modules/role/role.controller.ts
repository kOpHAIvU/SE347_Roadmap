import { LoginDto } from './../auth/dto/login-dto';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // @Get("roles")
  // async findRoleByLoginDto(loginDto: LoginDto): Promise<Array<string>> {
  //   return this.roleService.findOne(1);
  // } 
}
