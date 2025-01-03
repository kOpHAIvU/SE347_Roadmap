import { forwardRef, Module } from '@nestjs/common';
import { NodeService } from './node.service';
import { NodeController } from './node.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Node} from '../node/entities/node.entity'
import { RoadmapModule } from '../roadmap/roadmap.module';
import { RoleModule } from '../role/role.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerExceptionFilter } from 'src/common/exception-filter/ThrottlerException.filter';
import { TimelineModule } from '../timeline/timeline.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Node]),
    RoadmapModule,
    RoleModule,
    TimelineModule
  ],
  controllers: [NodeController],
  providers: [
    NodeService, 
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard
    // },
    // {
    //   provide: APP_FILTER,
    //   useClass: ThrottlerExceptionFilter,
    // },
  ],
  exports: [NodeService],
})
export class NodeModule {}
