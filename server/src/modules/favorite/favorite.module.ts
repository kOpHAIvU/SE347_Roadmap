import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { RoadmapModule } from '../roadmap/roadmap.module';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerExceptionFilter } from 'src/common/exception-filter/ThrottlerException.filter';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite]),
    RoadmapModule,
    UserModule,
    RoleModule
  ],
  controllers: [FavoriteController],
  providers: [
    FavoriteService,
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
export class FavoriteModule {}
