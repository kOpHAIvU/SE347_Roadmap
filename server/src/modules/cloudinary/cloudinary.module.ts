import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  controllers: [CloudinaryController],
  providers: [CloudinaryService, CloudinaryProvider],
  exports: [CloudinaryService]
})
export class CloudinaryModule {}
