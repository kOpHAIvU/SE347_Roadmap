import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { UserModule } from '../user/user.module';
import { MomoService } from './strategy/momo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    UserModule
  ],
  controllers: [PaymentController],
  providers: [PaymentService, MomoService],
  exports: [PaymentService],
})
export class PaymentModule {}
