import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login-dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{accessToken: string}> {
    const user = await this.userService.findOne(loginDto);
    console.log("User:", user);
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

  async googleLogin(req): Promise<any> {
    if (!req.user) {
      throw new Error('No user from google');
    }
    const { email, firstName, lastName, picture } = req.user;
    const user = await this.userService.findByEmail(email);

    // username: string;
    // password: string;
    // fullName: string;
    // gender: string;
    // email: string;
    // role: number;
    // avatar: string;

    if (user.statusCode == 500) {
      throw new Error('Server is not OK');
    } else if (user.statusCode == 200) { 
      throw new Error('User already exists');
    }

    const atIndex = email.indexOf('@');
    const usernameResponse = email.substring(0, atIndex);

    const createUserDto: CreateUserDto = {
      email,
      fullName: `${firstName} ${lastName}`,
      username: usernameResponse,
      password: "",
      gender: "",
      role: 2,
      avatar: picture
    }

    const createdUser = await this.userService.create(createUserDto);
    if(createdUser) {
      const payload = {email: createdUser.email, sub: createdUser.id};
      return {
        accessToken: this.jwtService.sign(payload)
      }
    }
    return {
      message: 'User information from google',
      user: req.user
    }
  }

}
