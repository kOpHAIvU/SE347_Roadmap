import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { UserModule } from '../user/user.module';
import { TeamModule } from '../team/team.module';
import { TimelineModule } from '../timeline/timeline.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    TeamModule,
    UserModule,
    TimelineModule
  ],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
