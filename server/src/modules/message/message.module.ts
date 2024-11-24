import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { TeamModule } from '../team/team.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    TeamModule,
    UserModule
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
