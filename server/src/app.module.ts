import { TypeOrmModuleOptions } from './../node_modules/@nestjs/typeorm/dist/interfaces/typeorm-options.interface.d';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Role } from './modules/role/entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/entities/user.entity';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoadmapModule } from './modules/roadmap/roadmap.module';
import { Roadmap } from './modules/roadmap/entities/roadmap.entity';
import { Comment } from './modules/comment/entities/comment.entity';
import { CommentModule } from './modules/comment/comment.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',  // Loại cơ sở dữ liệu
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Loantuyetcute',
      database: 'roadmap',
      entities: [User, Role, Roadmap, Comment],  // Đăng ký các entity
      synchronize: true,
    }),
    UserModule,
    RoleModule,
    AuthModule,
    RoadmapModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
