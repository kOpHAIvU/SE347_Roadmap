import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Progress } from './entities/progress.entity';
import { GroupDivisionModule } from '../group-division/group-division.module';
import { NodeModule } from '../node/node.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerExceptionFilter } from 'src/common/exception-filter/ThrottlerException.filter';
import { RoleModule } from '../role/role.module';
import { TeamModule } from '../team/team.module';
import { TimelineModule } from '../timeline/timeline.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Progress]),
    GroupDivisionModule,
    NodeModule,
    TeamModule,
    TimelineModule,
    RoleModule
  ],
  controllers: [ProgressController],
  providers: [
    ProgressService,
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard
    // },
    // {
    //   provide: APP_FILTER,
    //   useClass: ThrottlerExceptionFilter,
    // },
  ],
})
export class ProgressModule {}
