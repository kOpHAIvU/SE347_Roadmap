import { Module } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { RoadmapController } from './roadmap.controller';
import { Roadmap } from './entities/roadmap.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { RoleGuard } from '../role/common/role.guard';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Roadmap]),
    UserModule,
    RoleModule // import this module to use RoleGuard
  ],
  controllers: [RoadmapController],
  providers: [RoadmapService],
  exports: [RoadmapService]
})
export class RoadmapModule {}
