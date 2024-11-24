import { Module } from '@nestjs/common';
import { NodeService } from './node.service';
import { NodeController } from './node.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Node} from '../node/entities/node.entity'
import { RoadmapModule } from '../roadmap/roadmap.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Node]),
    RoadmapModule
  ],
  controllers: [NodeController],
  providers: [NodeService],
})
export class NodeModule {}
