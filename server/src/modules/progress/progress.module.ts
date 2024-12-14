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

@Module({
  imports: [
    TypeOrmModule.forFeature([Progress]),
    GroupDivisionModule,
    NodeModule
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
