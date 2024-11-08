import { Module } from '@nestjs/common';
import { TimelineService } from './timeline.service';
import { TimelineController } from './timeline.controller';
import { Roadmap } from '../roadmap/entities/roadmap.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timeline } from './entities/timeline.entity';
import { RoadmapModule } from '../roadmap/roadmap.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Timeline]),
    RoadmapModule,
    UserModule
  ],
  controllers: [TimelineController],
  providers: [TimelineService],
  exports: [TimelineService],
})
export class TimelineModule {}
