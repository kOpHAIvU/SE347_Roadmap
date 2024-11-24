import { Module } from '@nestjs/common';
import { GroupDivisionService } from './group-division.service';
import { GroupDivisionController } from './group-division.controller';
import { GroupDivision } from './entities/group-division.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { TimelineModule } from '../timeline/timeline.module';
import { TeamModule } from '../team/team.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupDivision]),
    UserModule,
    TimelineModule,
    TeamModule,
  ],
  controllers: [GroupDivisionController],
  providers: [GroupDivisionService],
})
export class GroupDivisionModule {}
