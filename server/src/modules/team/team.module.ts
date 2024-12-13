import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { TimelineModule } from '../timeline/timeline.module';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerExceptionFilter } from 'src/common/exception-filter/ThrottlerException.filter';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team]),
    TimelineModule,
    UserModule,
    RoleModule
  ],
  controllers: [TeamController],
  providers: [
    TeamService,
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
    TeamService,
  ],
})
export class TeamModule {}
