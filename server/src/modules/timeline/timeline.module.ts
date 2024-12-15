import { Module } from '@nestjs/common';
import { TimelineService } from './timeline.service';
import { TimelineController } from './timeline.controller';
import { Roadmap } from '../roadmap/entities/roadmap.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timeline } from './entities/timeline.entity';
import { RoadmapModule } from '../roadmap/roadmap.module';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerExceptionFilter } from 'src/common/exception-filter/ThrottlerException.filter';
import { NodeModule } from '../node/node.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Timeline]),
    RoadmapModule,
    UserModule,
    RoleModule,
    NodeModule
  ],
  controllers: [TimelineController],
  providers: [
    TimelineService,
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard
    // },
    // {
    //   provide: APP_FILTER,
    //   useClass: ThrottlerExceptionFilter,
    // },
  ],
  exports: [TimelineService],
})
export class TimelineModule {}
