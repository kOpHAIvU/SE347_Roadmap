import { Module } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { RoadmapController } from './roadmap.controller';

@Module({
  controllers: [RoadmapController],
  providers: [RoadmapService],
})
export class RoadmapModule {}
