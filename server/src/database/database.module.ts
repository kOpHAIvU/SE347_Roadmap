import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/modules/user/entities/user.entity';
import { Roadmap } from 'src/modules/roadmap/entities/roadmap.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { Timeline } from 'src/modules/timeline/entities/timeline.entity';
import { Team } from 'src/modules/team/entities/team.entity';
import {Report} from 'src/modules/report/entities/report.entity';
import {Notification} from 'src/modules/notification/entities/notification.entity';
import { GroupDivision } from 'src/modules/group-division/entities/group-division.entity';
import { Progress } from 'src/modules/progress/entities/progress.entity';
import { Message } from 'src/modules/message/entities/message.entity';
import { Favorite } from 'src/modules/favorite/entities/favorite.entity';
import {Comment} from 'src/modules/comment/entities/comment.entity';
import { Node } from 'src/modules/node/entities/node.entity';
import { Payment } from 'src/modules/payment/entities/payment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql', 
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User, Role, Roadmap, 
            Comment, Timeline, 
            Team, Report,
            Notification, Node,
            GroupDivision,
            Progress,
            Message, 
            Favorite,
            Payment,
          ],  
          synchronize: configService.get<string>('DATABASE_SYNC') === 'true',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
