import { Module } from '@nestjs/common';
import { GroupDivisionService } from './group-division.service';
import { GroupDivisionController } from './group-division.controller';
import { GroupDivision } from './entities/group-division.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { TimelineModule } from '../timeline/timeline.module';
import { TeamModule } from '../team/team.module';
import { RoleModule } from '../role/role.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerExceptionFilter } from 'src/common/exception-filter/ThrottlerException.filter';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupDivision]),
    UserModule,
    TimelineModule,
    TeamModule,
    RoleModule
  ],
  controllers: [GroupDivisionController],
  providers: [
    GroupDivisionService,
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard
    // },
    // {
    //   provide: APP_FILTER,
    //   useClass: ThrottlerExceptionFilter,
    // },
  ],
  exports: [GroupDivisionService],
})
export class GroupDivisionModule {}
