import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login-dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RoleService } from '../role/role.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{accessToken: string}> {
    const user = await this.userService.findOne(loginDto);
    const passwordMatched = await bcrypt.compare(
      loginDto.password, 
      user.password
    );

    if (!passwordMatched) {
      throw new Error('Invalid credentials');
    } else {
      const payload = {email: user.email, sub: user.id};
      return {
        accessToken: this.jwtService.sign(payload)
      }
    }
    
  }
}
