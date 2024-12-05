import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { env } from '../../configs/env.config';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { UserModule } from '../user/user.module';
import { NotificationGateway } from './notification.gateway';
import { NotificationWorker } from './notification.worker';
import { ConfigService } from '@nestjs/config';

@Module({
  imports:
    [
      TypeOrmModule.forFeature([Notification]), 
      ClientsModule.registerAsync([
        {
          name: 'RoadmapConfiguration',
          useFactory: (configService: ConfigService) => ({
            transport: Transport.RMQ,
            options: {
              urls: [configService.get<string>('URL')],
              queue: configService.get<string>('QUEUE_ROADMAP_NOTIFICATION'),
              queueOptions: {
                  durable: false,
                },
              }
          }),
          inject: [ConfigService],
        }
      ]),
      UserModule,
    ],
  controllers: [NotificationController],
  providers: [NotificationService, 
    NotificationGateway,
    NotificationWorker],
  exports: [NotificationService],
})
export class NotificationModule {}
