import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './modules/auth/common/jwt-guard';
import { Roles } from './modules/role/common/role.decorator';
import { RoleGuard } from './modules/role/common/role.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return "Hello world"
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('user')  
  getProfile(
    @Req() request,
  ): string {
    return request.user;
  }
}
