import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { RoadmapModule } from '../roadmap/roadmap.module';
import { Comment } from './entities/comment.entity';
import { UserModule } from '../user/user.module';
import { RoleGuard } from '../role/common/role.guard';
import { RoleModule } from '../role/role.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerExceptionFilter } from 'src/common/exception-filter/ThrottlerException.filter';
import { NodeModule } from '../node/node.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    RoadmapModule,
    UserModule,
    RoleModule,
    NodeModule
  ],
  controllers: [CommentController],
  providers: [
    CommentService, 
    RoleGuard,
  ],
  exports: [CommentService],
})
export class CommentModule {}
