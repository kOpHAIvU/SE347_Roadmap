import { Module } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { RoadmapController } from './roadmap.controller';
import { Roadmap } from './entities/roadmap.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Roadmap]),
    UserModule,
  ],
  controllers: [RoadmapController],
  providers: [RoadmapService],
  exports: [RoadmapService]
})
export class RoadmapModule {}
