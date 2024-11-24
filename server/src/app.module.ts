import { TypeOrmModuleOptions } from './../node_modules/@nestjs/typeorm/dist/interfaces/typeorm-options.interface.d';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Role } from './modules/role/entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/entities/user.entity';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoadmapModule } from './modules/roadmap/roadmap.module';
import { Roadmap } from './modules/roadmap/entities/roadmap.entity';
import { Comment } from './modules/comment/entities/comment.entity';
import { CommentModule } from './modules/comment/comment.module';
import { MessageModule } from './modules/message/message.module';
import { TimelineModule } from './modules/timeline/timeline.module';
import { Timeline } from './modules/timeline/entities/timeline.entity';
import { TeamModule } from './modules/team/team.module';
import { Team } from './modules/team/entities/team.entity';
import { GoogleStrategy } from './modules/auth/common/google.strategy';
import { GeminiModule } from './modules/gemini/gemini.module';
import {env} from './configs/env.config';
import { Report } from './modules/report/entities/report.entity';
import { ReportModule } from './modules/report/report.module';
import { Notification } from './modules/notification/entities/notification.entity';
import { NotificationModule } from './modules/notification/notification.module';
import { NodeModule } from './modules/node/node.module';
import {Node} from './modules/node/entities/node.entity'
import { GroupDivision } from './modules/group-division/entities/group-division.entity';
import { GroupDivisionModule } from './modules/group-division/group-division.module';
import { ProgressModule } from './modules/progress/progress.module';
import { Progress } from './modules/progress/entities/progress.entity';
import { Message } from './modules/message/entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: env.DATABASE.HOST,
      port: env.DATABASE.PORT,
      username: env.DATABASE.USER,
      password: env.DATABASE.PASSWORD,
      database: env.DATABASE.NAME,
      entities: [User, Role, Roadmap, 
        Comment, Timeline, 
        Team, Report,
        Notification, Node,
        GroupDivision,
        Progress,
        Message
      ],  
      synchronize: true,
    }),
    // ClientsModule.register([
    //   {
    //     name: env.RABBITMQ.NAME,
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: [env.RABBITMQ.URL],
    //       queue: env.RABBITMQ.QUEUE,
    //       queueOptions: {
    //         durable: true,
    //       },
    //     },
    //   },
    // ]),
    UserModule,
    RoleModule,
    AuthModule,
    RoadmapModule,
    CommentModule,
    MessageModule,
    TimelineModule,
    TeamModule,
    GeminiModule,
    ReportModule,
    NotificationModule,
    NodeModule,
    GroupDivisionModule,
    ProgressModule,
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule {}
