import { Injectable } from '@nestjs/common';
import { CreateCloudinaryDto } from './dto/create-cloudinary.dto';
import { UpdateCloudinaryDto } from './dto/update-cloudinary.dto';
import { v2 as cloudinary,UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { ResponseDto } from './common/respone.interface';

@Injectable()
export class CloudinaryService {

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'uploads' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      ).end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<ResponseDto> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return {
        statusCode: 200,
        message: 'Image deleted successfully',
        data: result,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null,
      }
    }
  }

  create(createCloudinaryDto: CreateCloudinaryDto) {
    return 'This action adds a new cloudinary';
  }

  findAll() {
    return `This action returns all cloudinary`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cloudinary`;
  }

  update(id: number, updateCloudinaryDto: UpdateCloudinaryDto) {
    return `This action updates a #${id} cloudinary`;
  }

  remove(id: number) {
    return `This action removes a #${id} cloudinary`;
  }
}
