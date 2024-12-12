import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {env} from './configs/env.config';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('server is running');

  //app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500'], // Thêm URL frontend của bạn vào đây
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3004);

  const microserviceApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [env.RABBITMQ.URL],
        queue: env.RABBITMQ.QUEUE_ROADMAP_NOTIFICATION,
        queueOptions: {
          durable: false,  
        },
      },
    },
  );

  app.useWebSocketAdapter(new IoAdapter(app));
  microserviceApp.listen(); 

}
bootstrap();
