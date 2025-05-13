/* eslint-disable no-console */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import 'dotenv/config';
import { AppModule } from './app.module';

const port = process.env.PORT ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  await app.listen(port);
}

bootstrap()
  .then(() => {
    console.log(`Server is running on port ${port}`);
  })
  .catch((error) => {
    console.error('Error starting the server:', error);
    process.exit(1);
  });
