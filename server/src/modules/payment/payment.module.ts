import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { UserModule } from '../user/user.module';
import { MomoService } from './strategy/momo.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    UserModule,
    ConfigModule,
    CloudinaryModule
  ],
  controllers: [PaymentController],
  providers: [PaymentService, MomoService, ConfigService],
  exports: [PaymentService],
})
export class PaymentModule {}
