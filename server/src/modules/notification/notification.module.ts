import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { UserModule } from '../user/user.module';
import { NotificationGateway } from './notification.gateway';
import { ConfigService } from '@nestjs/config';
import { RoleModule } from '../role/role.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerExceptionFilter } from 'src/common/exception-filter/ThrottlerException.filter';
import { GmailNotificationStrategy } from './strategy/gmail-notification.service';
import { SMSNotificationStrategy } from './strategy/sms-notification.service';
import { FirebaseModule } from '../firebase/firebase.module';

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
      RoleModule,
      FirebaseModule
    ],
  controllers: [NotificationController],
  providers: [NotificationService, 
    NotificationGateway,
    GmailNotificationStrategy,
    SMSNotificationStrategy,
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard
    // },
    // {
    //   provide: APP_FILTER,
    //   useClass: ThrottlerExceptionFilter,
    // },
  ],
  exports: [
    NotificationService,
    GmailNotificationStrategy,
  ],
})
export class NotificationModule {}
