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
import { ConfigModule } from '@nestjs/config';
import dbConfig from './config/db.config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',  // Loại cơ sở dữ liệu
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Loantuyetcute',
      database: 'roadmap',
      entities: [User, Role],  // Đăng ký các entity
      synchronize: true,
    }),
    UserModule,
    RoleModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load:[dbConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
