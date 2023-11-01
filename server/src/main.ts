import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger('Main (main.ts)');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  // Get the port from .env file
  const port = configService.get('PORT');
  const clientPort = configService.get('CLIENT_PORT');

  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Enable CORS for the client
  app.enableCors({
    origin: [
      `http://localhost:${clientPort}`,
      new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`),
    ],
  });

  await app.listen(port);

  logger.log(`Server running on http://localhost:${port}`);
}

bootstrap();
