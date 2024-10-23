import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('server is running');
  //app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({
    origin: 'http://localhost:3000', // Cho phép domain cụ thể
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Phương thức HTTP được phép
    credentials: true, // Cho phép gửi cookies với request
  });
  await app.listen(3004);

}
bootstrap();
