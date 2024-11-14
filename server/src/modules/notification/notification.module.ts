import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { env } from '../../configs/env.config';

@Module({
  imports: [
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
  ],

  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
