import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from '../auth/dto/login-dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Avatar field in User has the format like "secure_url public_id"
  // secure_url is the public URL of the image
  // public_id is the ID of the image in Cloudinary
  // We use public_id to delete the image in Cloudinary
  @Post('signup')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    // const fileBuffer = file?.buffer.toString('base64') || null;
    return await this.userService.create(createUserDto, file);
  }
  
  @Get("id/:id")
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOneById(+id);
  }

  @Get("hi")
  async findOne(@Body() loginDto: LoginDto)
  {
    return await this.userService.findOne(loginDto);
  }

  @Patch('item/:id')
  async update(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.userService.update(+id, updateUserDto, file);
  }

  @Delete('item/:id')
  async remove(@Param('id') id: string) {
    return  await this.userService.remove(+id);
  }
}
