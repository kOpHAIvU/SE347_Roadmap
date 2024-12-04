import { Module } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { RoadmapController } from './roadmap.controller';
import { Roadmap } from './entities/roadmap.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { RoleGuard } from '../role/common/role.guard';
import { RoleModule } from '../role/role.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {env} from '../../configs/env.config'

@Module({
  imports: [
    TypeOrmModule.forFeature([Roadmap]),
    ClientsModule.register([
      {
        name: env.RABBITMQ.NAME,
        transport: Transport.RMQ,
        options: {
          urls: [env.RABBITMQ.URL],
          queue: env.RABBITMQ.QUEUE_ROADMAP_NOTIFICATION,
          queueOptions: {
            durable: false
          },
        },
      }
    ]),
    UserModule,
    RoleModule,
  ],
  controllers: [RoadmapController],  
  providers: [RoadmapService],
  exports: [RoadmapService]
})
export class RoadmapModule {}
