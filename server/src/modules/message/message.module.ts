import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { TeamModule } from '../team/team.module';
import { UserModule } from '../user/user.module';
import { MessageGateway } from './message.gateway';
import { RoleModule } from '../role/role.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerExceptionFilter } from 'src/common/exception-filter/ThrottlerException.filter';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    TeamModule,
    UserModule,
    RoleModule
  ],
  controllers: [MessageController],
  providers: [
    MessageService, 
    MessageGateway,
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard
    // },
    // {
    //   provide: APP_FILTER,
    //   useClass: ThrottlerExceptionFilter,
    // },
  ],
  exports: [MessageService],
})
export class MessageModule {}
