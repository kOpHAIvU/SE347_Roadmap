import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerExceptionFilter } from 'src/common/exception-filter/ThrottlerException.filter';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ReportGateway } from './report.gateway';
import { FirebaseModule } from '../firebase/firebase.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report]),
    ClientsModule.registerAsync([
      {
        name: 'RoadmapConfigurationReport',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('URL')],
            queue: configService.get<string>('QUEUE_SEND_REPORT'),
            queueOptions: {
                durable: true,
              },
            }
        }),
        inject: [ConfigService],
      }
    ]),
    UserModule,
    RoleModule,
    FirebaseModule,
    NotificationModule,
  ],
  controllers: [ReportController],
  providers: [
    ReportService,
    ReportGateway,
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard
    // },
    // {
    //   provide: APP_FILTER,
    //   useClass: ThrottlerExceptionFilter,
    // },
  ],
  exports: [ReportService],
})
export class ReportModule {}
