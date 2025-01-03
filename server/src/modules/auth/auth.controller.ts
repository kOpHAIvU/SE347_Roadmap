import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './common/jwt-guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}

    // Login
    @Post('login')
    async login(
        @Body()
        loginDTO: LoginDto,
    ) {
        return await this.authService.login(loginDTO);
    }

    // Login by google account
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req) {
        return await this.authService.googleLogin(req);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    async viewProfile(@Req() req: any) {
        const userId = req.user.userId;
        return await this.userService.findOneById(userId);
    }
}
