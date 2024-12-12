import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Progress } from './entities/progress.entity';
import { GroupDivisionModule } from '../group-division/group-division.module';
import { NodeModule } from '../node/node.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Progress]),
    GroupDivisionModule,
    NodeModule
  ],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}
