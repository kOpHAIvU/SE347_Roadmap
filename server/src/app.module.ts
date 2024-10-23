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
import { MemberModule } from './modules/member/member.module';
import { MessageModule } from './modules/message/message.module';
import { PerformanceModule } from './modules/performance/performance.module';
import { TimelineModule } from './modules/timeline/timeline.module';
import { Timeline } from './modules/timeline/entities/timeline.entity';
import { Member } from './modules/member/entities/member.entity';
import { TeamModule } from './modules/team/team.module';
import { Team } from './modules/team/entities/team.entity';
import { GoogleStrategy } from './modules/auth/common/google.strategy';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',  
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Loantuyetcute',
      database: 'roadmap',
      entities: [User, Role, Roadmap, 
        Comment, Timeline, 
        Member, Team
      ],  
      synchronize: true,
    }),
    UserModule,
    RoleModule,
    AuthModule,
    RoadmapModule,
    CommentModule,
    MemberModule,
    MessageModule,
    PerformanceModule,
    TimelineModule,
    TeamModule
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule {}
