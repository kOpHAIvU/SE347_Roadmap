import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryProvider } from './cloudinary.provider';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  controllers: [CloudinaryController],
  providers: [
    CloudinaryService, 
    CloudinaryProvider,
  ],
  exports: [CloudinaryService]
})
export class CloudinaryModule {}
