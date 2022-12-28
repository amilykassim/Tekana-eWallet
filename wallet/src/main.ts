import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER_URL],
        retry: { retries: 50 }
      },
      consumer: {
        groupId: process.env.GROUP_ID,
        retry: { retries: 50 }
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(4000);
}
bootstrap();
