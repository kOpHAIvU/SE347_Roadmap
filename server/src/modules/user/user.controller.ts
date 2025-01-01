import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    UseInterceptors,
    UploadedFile,
    UseGuards,
    Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from '../auth/dto/login-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/common/jwt-guard';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../role/common/role.guard';
import { Roles } from '../role/common/role.decorator';
import { Request } from 'express';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // Avatar field in User has the format like "secure_url public_id"
    // secure_url is the public URL of the image
    // public_id is the ID of the image in Cloudinary
    // We use public_id to delete the image in Cloudinary
    @Post('signup')
    @UseInterceptors(FileInterceptor('file'))
    async create(@Body() createUserDto: CreateUserDto, @UploadedFile() file?: Express.Multer.File) {
        console.log('File in controller:', file);
        //const fileBuffer = file?.buffer.toString('base64') || null;
        return await this.userService.create(createUserDto, file);
    }

    // View profile of user: Feature of admin right
    @Get('item/:id')
    @UseGuards(JwtAuthGuard)
    @Roles('admin')
    async findOneById(@Param('id', ParseIntPipe) id: number) {
        return await this.userService.findOneById(+id);
    }

    @Patch('updateProfile')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async update(@Req() req: any, @Body() updateUserDto: UpdateUserDto, @UploadedFile() file?: Express.Multer.File) {
        const userId = req.user.userId;
        return await this.userService.update(userId, updateUserDto, file);
    }

    @Delete('item/:id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string) {
        return await this.userService.remove(+id);
    }

    @Get('search/:name')
    @UseGuards(JwtAuthGuard)
    async search(@Param('name') name: string) {
        return await this.userService.findUserByName(name);
    }

    @Get('all')
    
    async findAll() {
        return await this.userService.findAllFirebase();
    }
}
