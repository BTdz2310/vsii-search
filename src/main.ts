import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'search',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'search-consumer',
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(3003);
}
bootstrap();
