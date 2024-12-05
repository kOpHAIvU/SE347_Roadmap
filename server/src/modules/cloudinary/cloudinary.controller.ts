import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { UpdateCloudinaryDto } from './dto/update-cloudinary.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadImage(file);
    return {
      message: 'Image uploaded successfully',
      data: result,
    };
  }

  @Delete('image')
  async deleteImage(
    @Body('public_id') publicId: string
  ) {
    return await this.cloudinaryService.deleteImage(publicId);
  }

  @Get()
  findAll() {
    return this.cloudinaryService.findAll();
  }

  @Get('item/:id')
  async findOne(@Param('id') id: string) {
    return await this.cloudinaryService.findOne(+id);
  }

  @Patch('item/:id')
  async update(@Param('id') id: string, @Body() updateCloudinaryDto: UpdateCloudinaryDto) {
    return  await this.cloudinaryService.update(+id, updateCloudinaryDto);
  }


}
