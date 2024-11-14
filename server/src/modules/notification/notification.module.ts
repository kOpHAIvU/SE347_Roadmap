import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { env } from '../../configs/env.config';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports:
    [
      TypeOrmModule.forFeature([Notification]), 
      ClientsModule.register([
        {
          name: 'NOTIFICATION_SERVICE',
          transport: Transport.RMQ,
          options: {
            urls: [env.RABBITMQ.URL],
            queue: env.RABBITMQ.QUEUE,
            queueOptions: {
              durable: false,
            },
          },
        },
      ]),
      UserModule,
    ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
