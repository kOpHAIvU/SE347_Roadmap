import { Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post('signup')
  async signup(
    @Body() 
    userDto: CreateUserDto
  ): Promise<User> {
    return await this.userService.create(userDto);
  }
// string 
  @Post('login')
  async login(
    @Body()
    loginDTO: LoginDto,
  ) {
    return await this.authService.login(loginDTO);
  }

  @Get('googleAuth')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {

  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return await this.authService.googleLogin(req);
  }
}
